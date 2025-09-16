"use client"

import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Settings, Trash } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { useState } from "react";

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
    const [environmentVariables, setEnvironmentVariables] = useState<EnvironmentVariable[]>([
        { id: "1", key: "", value: "" }
    ]);
    const [secrets, setSecrets] = useState<Secret[]>([
        { id: "1", key: "", value: "" }
    ]);
    
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
        const newId = (environmentVariables.length + 1).toString();
        setEnvironmentVariables([...environmentVariables, { id: newId, key: "", value: "" }]);
    };

    const removeEnvironmentVariable = (id: string) => {
        if (environmentVariables.length > 1) {
            setEnvironmentVariables(environmentVariables.filter(env => env.id !== id));
        }
    };

    const updateEnvironmentVariable = (id: string, field: 'key' | 'value', value: string) => {
        setEnvironmentVariables(environmentVariables.map(env => 
            env.id === id ? { ...env, [field]: value } : env
        ));
    };

    const addSecret = () => {
        const newId = (secrets.length + 1).toString();
        setSecrets([...secrets, { id: newId, key: "", value: "" }]);
    };

    const removeSecret = (id: string) => {
        if (secrets.length > 1) {
            setSecrets(secrets.filter(secret => secret.id !== id));
        }
    };

    const updateSecret = (id: string, field: 'key' | 'value', value: string) => {
        setSecrets(secrets.map(secret => 
            secret.id === id ? { ...secret, [field]: value } : secret
        ));
    };

    return (
        <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            <Card className="w-full shadow-none">
                <CardHeader>
                    <CardTitle className=" text-blue-700 dark:text-blue-400">Environment</CardTitle>
                    <CardDescription>Create a new environment</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Github Organization:</Label>
                            <Select>
                                <SelectTrigger className="w-full shadow-none">
                                    <SelectValue placeholder="Select an organization" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="1">Organization 1</SelectItem>
                                    <SelectItem value="2">Organization 2</SelectItem>
                                    <SelectItem value="3">Organization 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Github Repository:</Label>
                            <Select>
                                <SelectTrigger className="w-full shadow-none">
                                    <SelectValue placeholder="Select a repository" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="1">Repository 1</SelectItem>
                                    <SelectItem value="2">Repository 2</SelectItem>
                                    <SelectItem value="3">Repository 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Name:</Label>
                            <Input
                                className="w-full shadow-none"
                                placeholder="Enter the name of the environment"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Description:</Label>
                            <Textarea
                                className="w-full shadow-none"
                                placeholder="Enter the description of the environment"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full shadow-none">
                <CardHeader>
                    <CardTitle className="text-blue-700 dark:text-blue-400">Container</CardTitle>
                    <CardDescription>Configure the container</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Image:</Label>
                            <div className="flex flex-row gap-2 w-full">
                            <Select>
                                <SelectTrigger className="w-full shadow-none">
                                    <SelectValue placeholder="Select an image" defaultValue="1" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                    <SelectItem value="1">Universal</SelectItem>
                                </SelectContent>
                            </Select>
                            <Dialog>
                                <form>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="icon"><Settings /></Button>
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                                <SelectTrigger className="w-full shadow-none">
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
                                </form>
                            </Dialog>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Environment Variables:</Label>
                            <div className="flex flex-col gap-2 w-full">
                                {environmentVariables.map((envVar) => (
                                    <div key={envVar.id} className="flex flex-row gap-2 w-full">
                                        <Input
                                            className="w-full shadow-none"
                                            placeholder="Key"
                                            value={envVar.key}
                                            onChange={(e) => updateEnvironmentVariable(envVar.id, 'key', e.target.value)}
                                            onBlur={(e) => {
                                                if (e.target.value && envVar.id === environmentVariables[environmentVariables.length - 1].id) {
                                                    addEnvironmentVariable();
                                                }
                                            }}
                                        />
                                        <Input
                                            className="w-full shadow-none"
                                            placeholder="Value"
                                            value={envVar.value}
                                            onChange={(e) => updateEnvironmentVariable(envVar.id, 'value', e.target.value)}
                                        />
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            onClick={() => removeEnvironmentVariable(envVar.id)}
                                        >
                                            <Trash />
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
                                            className="w-full shadow-none"
                                            placeholder="Key"
                                            value={secret.key}
                                            onChange={(e) => updateSecret(secret.id, 'key', e.target.value)}
                                            onBlur={(e) => {
                                                if (e.target.value && secret.id === secrets[secrets.length - 1].id) {
                                                    addSecret();
                                                }
                                            }}
                                        />
                                        <Input
                                            className="w-full shadow-none"
                                            placeholder="Value"
                                            value={secret.value}
                                            onChange={(e) => updateSecret(secret.id, 'value', e.target.value)}
                                        />
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            onClick={() => removeSecret(secret.id)}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Container Caching:</Label>
                            <div className="flex flex-row gap-2 w-full">
                            <ToggleGroup type="single" defaultValue="1" className="w-full" variant="outline">
                                <ToggleGroupItem value="1">Disabled</ToggleGroupItem>
                                <ToggleGroupItem value="2">Enabled</ToggleGroupItem>
                            </ToggleGroup>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Setup Script:</Label>
                            <div className="flex flex-row gap-2 w-full">
                            <ToggleGroup 
                                type="single" 
                                value={setupScriptMode}
                                onValueChange={setSetupScriptMode}
                                className="w-full" 
                                variant="outline"
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
                                    className="w-full shadow-none"
                                    placeholder="Enter your custom setup script commands..."
                                    rows={6}
                                />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-2">
                            <Label className="w-full">Internet Access:</Label>
                            <div className="flex flex-row gap-2 w-full">
                            <ToggleGroup type="single" defaultValue="1" className="w-full" variant="outline">
                                <ToggleGroupItem value="1">Disabled</ToggleGroupItem>
                                <ToggleGroupItem value="2">Enabled</ToggleGroupItem>
                            </ToggleGroup>
                            </div>
                        </div>

                    </div>



                </CardContent>
            </Card>

            <div className="flex flex-row gap-2 justify-end">
            <Button className="w-fit">Create Environment</Button>
            </div>

        </div>
    )
  }