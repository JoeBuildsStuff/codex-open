"use client"

import { FormEvent, useState } from "react";
import { Settings, Trash } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const createLocalId = () => Math.random().toString(36).slice(2, 10);
const ENV_VAR_KEY_REGEX = /^[A-Z][A-Z0-9_]*$/;

interface EnvironmentVariable {
  id: string;
  key: string;
  value: string;
}

interface Secret {
  id: string;
  key: string;
  value: string;
}

export default function EnvironmentForm() {
  const [setupScriptMode, setSetupScriptMode] = useState("1"); // "1" for Automatic, "2" for Manual
  const [environmentVariables, setEnvironmentVariables] = useState<EnvironmentVariable[]>(() => [
    { id: createLocalId(), key: "", value: "" },
  ]);
  const [secrets, setSecrets] = useState<Secret[]>(() => [
    { id: createLocalId(), key: "", value: "" },
  ]);

  const [githubOrg, setGithubOrg] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [containerImage, setContainerImage] = useState("universal");
  const [containerCachingEnabled, setContainerCachingEnabled] = useState(false);
  const [internetAccessEnabled, setInternetAccessEnabled] = useState(false);
  const [setupScript, setSetupScript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Package version states
  const [pythonVersion, setPythonVersion] = useState("3.12");
  const [nodeVersion, setNodeVersion] = useState("20");
  const [rubyVersion, setRubyVersion] = useState("3.4.4");
  const [rustVersion, setRustVersion] = useState("1.89.0");
  const [goVersion, setGoVersion] = useState("1.24.3");
  const [bunVersion, setBunVersion] = useState("1.2.14");
  const [phpVersion, setPhpVersion] = useState("8.4");
  const [javaVersion, setJavaVersion] = useState("21");
  const [swiftVersion, setSwiftVersion] = useState("6.1");

  const addEnvironmentVariable = () => {
    setEnvironmentVariables((prev) => [
      ...prev,
      { id: createLocalId(), key: "", value: "" },
    ]);
  };

  const removeEnvironmentVariable = (id: string) => {
    setEnvironmentVariables((prev) =>
      prev.length > 1 ? prev.filter((env) => env.id !== id) : prev,
    );
  };

  const updateEnvironmentVariable = (
    id: string,
    field: "key" | "value",
    value: string,
  ) => {
    setEnvironmentVariables((prev) =>
      prev.map((env) => (env.id === id ? { ...env, [field]: value } : env)),
    );
  };

  const addSecret = () => {
    setSecrets((prev) => [...prev, { id: createLocalId(), key: "", value: "" }]);
  };

  const removeSecret = (id: string) => {
    setSecrets((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev));
  };

  const updateSecret = (id: string, field: "key" | "value", value: string) => {
    setSecrets((prev) =>
      prev.map((secret) => (secret.id === id ? { ...secret, [field]: value } : secret)),
    );
  };

  const handleSetupScriptModeChange = (value: string) => {
    if (!value) return;
    setSetupScriptMode(value);
    if (value === "1") {
      setSetupScript("");
    }
  };

  const resetForm = () => {
    setGithubOrg("");
    setGithubRepo("");
    setName("");
    setDescription("");
    setContainerImage("universal");
    setContainerCachingEnabled(false);
    setInternetAccessEnabled(false);
    setSetupScriptMode("1");
    setSetupScript("");
    setPythonVersion("3.12");
    setNodeVersion("20");
    setRubyVersion("3.4.4");
    setRustVersion("1.89.0");
    setGoVersion("1.24.3");
    setBunVersion("1.2.14");
    setPhpVersion("8.4");
    setJavaVersion("21");
    setSwiftVersion("6.1");
    setEnvironmentVariables([{ id: createLocalId(), key: "", value: "" }]);
    setSecrets([{ id: createLocalId(), key: "", value: "" }]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error("Environment name is required.");
      return;
    }

    const sanitizedVariables: Array<{
      name: string;
      value: string;
      is_secret: boolean;
    }> = [];
    const seenKeys = new Set<string>();
    let hasValidationError = false;

    const collectVariables = (
      entries: Array<EnvironmentVariable | Secret>,
      isSecret: boolean,
    ) => {
      entries.forEach((entry) => {
        if (hasValidationError) return;

        const key = entry.key.trim();
        const value = entry.value.trim();

        if (!key && !value) {
          return;
        }

        if (!key || !value) {
          toast.error("Environment variables and secrets require both a key and value.");
          hasValidationError = true;
          return;
        }

        const normalizedKey = key.toUpperCase();
        if (!ENV_VAR_KEY_REGEX.test(normalizedKey)) {
          toast.error(
            "Keys must start with a letter and use only A-Z, 0-9, and underscores.",
          );
          hasValidationError = true;
          return;
        }

        if (seenKeys.has(normalizedKey)) {
          toast.error(`Duplicate key "${normalizedKey}" detected.`);
          hasValidationError = true;
          return;
        }

        seenKeys.add(normalizedKey);
        sanitizedVariables.push({
          name: normalizedKey,
          value,
          is_secret: isSecret,
        });
      });
    };

    collectVariables(environmentVariables, false);
    collectVariables(secrets, true);

    if (hasValidationError) {
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const setupMode = setupScriptMode === "2" ? "manual" : "automatic";
      const scriptValue =
        setupMode === "manual" ? setupScript.trim() || null : null;

      const { data, error } = await supabase
        .from("environments")
        .insert({
          github_org: githubOrg || null,
          github_repo: githubRepo || null,
          name: trimmedName,
          description: description.trim() || null,
          container_image: containerImage,
          python_version: pythonVersion,
          node_version: nodeVersion,
          ruby_version: rubyVersion,
          rust_version: rustVersion,
          go_version: goVersion,
          bun_version: bunVersion,
          php_version: phpVersion,
          java_version: javaVersion,
          swift_version: swiftVersion,
          setup_script_mode: setupMode,
          setup_script: scriptValue,
          container_caching_enabled: containerCachingEnabled,
          internet_access_enabled: internetAccessEnabled,
        })
        .select("id")
        .single();

      if (error || !data) {
        toast.error(error?.message ?? "Failed to create environment.");
        return;
      }

      if (sanitizedVariables.length > 0) {
        const { error: variableError } = await supabase
          .from("environment_variables")
          .insert(
            sanitizedVariables.map((variable) => ({
              ...variable,
              environment_id: data.id,
            })),
          );

        if (variableError) {
          await supabase.from("environments").delete().eq("id", data.id);
          toast.error(variableError.message);
          return;
        }
      }

      toast.success("Environment created.");
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-4xl mx-auto border border-border rounded-2xl">
      <Card className="w-full shadow-none bg-background border border-none">
        <CardHeader>
          <CardTitle className=" text-blue-700 dark:text-blue-400">Environment</CardTitle>
          <CardDescription>Create a new environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Github Organization:</Label>
              <Select value={githubOrg} onValueChange={setGithubOrg}>
                <SelectTrigger className="w-full shadow-none border-none">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="acme-inc">Acme Inc</SelectItem>
                  <SelectItem value="codex-labs">Codex Labs</SelectItem>
                  <SelectItem value="open-source">Open Source</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Github Repository:</Label>
              <Select value={githubRepo} onValueChange={setGithubRepo}>
                <SelectTrigger className="w-full shadow-none border-none">
                  <SelectValue placeholder="Select a repository" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="codex-open">codex-open</SelectItem>
                  <SelectItem value="codex-runtime">codex-runtime</SelectItem>
                  <SelectItem value="infra-tools">infra-tools</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Name:</Label>
              <Input
                className="w-full shadow-none border-none"
                placeholder="Enter the name of the environment"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Description:</Label>
              <Textarea
                className="w-full shadow-none border-none"
                placeholder="Enter the description of the environment"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      <Card className="w-full shadow-none bg-background border border-none">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-400">Container</CardTitle>
          <CardDescription>Configure the container</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Image:</Label>
              <div className="flex flex-row gap-2 w-full">
                <Select value={containerImage} onValueChange={setContainerImage}>
                  <SelectTrigger className="w-full shadow-none border-none">
                    <SelectValue placeholder="Select an image" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    <SelectItem value="universal">Universal</SelectItem>
                    <SelectItem value="node">Node</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="border-none">
                      <Settings className="size-4" strokeWidth={1} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Preinstalled packages</DialogTitle>
                      <DialogDescription>
                        Configure your own packages in the setup script.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">Python:</Label>
                        <Select value={pythonVersion} onValueChange={setPythonVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a Python version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="3.13">Python 3.13</SelectItem>
                            <SelectItem value="3.12">Python 3.12</SelectItem>
                            <SelectItem value="3.11">Python 3.11</SelectItem>
                            <SelectItem value="3.10">Python 3.10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">Node:</Label>
                        <Select value={nodeVersion} onValueChange={setNodeVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a Node version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="22">Node 22</SelectItem>
                            <SelectItem value="20">Node 20</SelectItem>
                            <SelectItem value="18">Node 18</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">Ruby:</Label>
                        <Select value={rubyVersion} onValueChange={setRubyVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a Ruby version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="3.4.4">Ruby 3.4.4</SelectItem>
                            <SelectItem value="3.3.6">Ruby 3.3.6</SelectItem>
                            <SelectItem value="3.2.4">Ruby 3.2.4</SelectItem>
                            <SelectItem value="3.1.4">Ruby 3.1.4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">Rust:</Label>
                        <Select value={rustVersion} onValueChange={setRustVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a Rust version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="1.89.0">Rust 1.89.0</SelectItem>
                            <SelectItem value="1.88.0">Rust 1.88.0</SelectItem>
                            <SelectItem value="1.87.0">Rust 1.87.0</SelectItem>
                            <SelectItem value="1.86.0">Rust 1.86.0</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">Go:</Label>
                        <Select value={goVersion} onValueChange={setGoVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a Go version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="1.24.3">Go 1.24.3</SelectItem>
                            <SelectItem value="1.23.4">Go 1.23.4</SelectItem>
                            <SelectItem value="1.22.4">Go 1.22.4</SelectItem>
                            <SelectItem value="1.21.9">Go 1.21.9</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">Bun:</Label>
                        <Select value={bunVersion} onValueChange={setBunVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a Bun version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="1.2.14">Bun 1.2.14</SelectItem>
                            <SelectItem value="1.1.38">Bun 1.1.38</SelectItem>
                            <SelectItem value="1.0.33">Bun 1.0.33</SelectItem>
                            <SelectItem value="0.9.1">Bun 0.9.1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">PHP:</Label>
                        <Select value={phpVersion} onValueChange={setPhpVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a PHP version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="8.4">PHP 8.4</SelectItem>
                            <SelectItem value="8.3">PHP 8.3</SelectItem>
                            <SelectItem value="8.2">PHP 8.2</SelectItem>
                            <SelectItem value="8.1">PHP 8.1</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">Java:</Label>
                        <Select value={javaVersion} onValueChange={setJavaVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a Java version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="21">Java 21</SelectItem>
                            <SelectItem value="17">Java 17</SelectItem>
                            <SelectItem value="11">Java 11</SelectItem>
                            <SelectItem value="8">Java 8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Label className="w-full">Swift:</Label>
                        <Select value={swiftVersion} onValueChange={setSwiftVersion}>
                          <SelectTrigger className="w-full shadow-none border-none">
                            <SelectValue placeholder="Select a Swift version" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="6.1">Swift 6.1</SelectItem>
                            <SelectItem value="6.0">Swift 6.0</SelectItem>
                            <SelectItem value="5.10">Swift 5.10</SelectItem>
                            <SelectItem value="5.9">Swift 5.9</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Environment Variables:</Label>
              <div className="flex flex-col gap-2 w-full">
                {environmentVariables.map((envVar) => (
                  <div key={envVar.id} className="flex flex-row gap-2 w-full">
                    <Input
                      className="w-full shadow-none border-none"
                      placeholder="Key"
                      value={envVar.key}
                      onChange={(event) =>
                        updateEnvironmentVariable(envVar.id, "key", event.target.value)
                      }
                      onBlur={(event) => {
                        if (
                          event.target.value &&
                          envVar.id === environmentVariables[environmentVariables.length - 1].id
                        ) {
                          addEnvironmentVariable();
                        }
                      }}
                    />
                    <Input
                      className="w-full shadow-none border-none"
                      placeholder="Value"
                      value={envVar.value}
                      onChange={(event) =>
                        updateEnvironmentVariable(envVar.id, "value", event.target.value)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEnvironmentVariable(envVar.id)} 
                    >
                      <Trash className="size-4" strokeWidth={1} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Secrets:</Label>
              <div className="flex flex-col gap-2 w-full">
                {secrets.map((secret) => (
                  <div key={secret.id} className="flex flex-row gap-2 w-full">
                    <Input
                      className="w-full shadow-none border-none"
                      placeholder="Key"
                      value={secret.key}
                      onChange={(event) => updateSecret(secret.id, "key", event.target.value)}
                      onBlur={(event) => {
                        if (
                          event.target.value &&
                          secret.id === secrets[secrets.length - 1].id
                        ) {
                          addSecret();
                        }
                      }}
                    />
                    <Input
                      className="w-full shadow-none border-none"
                      placeholder="Value"
                      value={secret.value}
                      onChange={(event) => updateSecret(secret.id, "value", event.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSecret(secret.id)}
                    >
                      <Trash className="size-4" strokeWidth={1} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Container Caching:</Label>
              <div className="flex flex-row gap-2 w-full">
                <ToggleGroup
                  type="single"
                  value={containerCachingEnabled ? "enabled" : "disabled"}
                  onValueChange={(value) => {
                    if (!value) return;
                    setContainerCachingEnabled(value === "enabled");
                  }}
                  className="w-full"
                  // variant="outline"
                >
                  <ToggleGroupItem value="disabled">Disabled</ToggleGroupItem>
                  <ToggleGroupItem value="enabled">Enabled</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Setup Script:</Label>
              <div className="flex flex-row gap-2 w-full">
                <ToggleGroup
                  type="single"
                  value={setupScriptMode}
                  onValueChange={handleSetupScriptModeChange}
                  className="w-full"
                  // variant="outline"
                >
                  <ToggleGroupItem value="1">Automatic</ToggleGroupItem>
                  <ToggleGroupItem value="2">Manual</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {setupScriptMode === "2" && (
              <div className="flex flex-col md:flex-row gap-2">
                <Label className="w-full"></Label>
                <div className="flex flex-row gap-2 w-full">
                  <Textarea
                    className="w-full shadow-none border-none"
                    placeholder="Enter your custom setup script commands..."
                    rows={6}
                    value={setupScript}
                    onChange={(event) => setSetupScript(event.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-2">
              <Label className="w-full">Internet Access:</Label>
              <div className="flex flex-row gap-2 w-full">
                <ToggleGroup
                  type="single"
                  value={internetAccessEnabled ? "enabled" : "disabled"}
                  onValueChange={(value) => {
                    if (!value) return;
                    setInternetAccessEnabled(value === "enabled");
                  }}
                  className="w-full"
                  // variant="outline"
                >
                  <ToggleGroupItem value="disabled">Disabled</ToggleGroupItem>
                  <ToggleGroupItem value="enabled">Enabled</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-row justify-end">
        <Button className="w-fit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Environment"}
        </Button>
      </div>
    </form>
  );
}
