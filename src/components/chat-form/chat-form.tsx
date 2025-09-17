"use client"

import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, GitBranch, Layers, Mic, Paperclip, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Environment } from "@/app/environment/_lib/validations";
import SelectSearchButton, { SelectOption } from "@/components/ui/select-search-button";

interface ChatFormProps {
  environments: Environment[];
}

export default function ChatForm({ environments }: ChatFormProps) {
  const environmentOptions: SelectOption[] = environments.map((env) => ({
    value: env.id,
    label: env.github_org && env.github_repo 
      ? `${env.github_org}/${env.github_repo}` 
      : env.name
  }));

  const handleNewEnvironment = () => {
    // Navigate to environment creation page
    window.location.href = '/environment';
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-5">
            <h1 className="text-3xl text-center">What should we code next?</h1>
            <div className="flex flex-col justify-between h-[11rem] br-background dark:bg-secondary rounded-3xl border border-border p-2">
                <Textarea className="w-full border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none" placeholder="Describe a task..." />
                <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                    <Button size="icon" variant="secondary" className="bg-input/30 shadow-none rounded-xl">
                        <Paperclip className="size-4" />
                    </Button>
                    <SelectSearchButton
                        options={environmentOptions}
                        value={environments[0]?.id || ""}
                        placeholder="Select environment"
                        searchPlaceholder="Find environment"
                        emptyMessage="No environment found."
                        buttonText="New environment"
                        buttonIcon={<Plus className="size-4 mr-1" />}
                        onButtonClick={handleNewEnvironment}
                        buttonClassName="border-none bg-input/30 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl shadow-none"
                        className=""
                    />
       
                    <Button variant="ghost" className="rounded-xl">
                        <GitBranch className="size-4" />
                        Main
                        <ChevronDown className="size-4" />
                    </Button>
                    <div className="flex items-center">
                      <Select defaultValue="1x">
                        <SelectTrigger className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl shadow-none">
                        <Layers className="size-4 mr-1 text-muted-foreground" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1x">1x</SelectItem>
                          <SelectItem value="2x">2x</SelectItem>
                          <SelectItem value="3x">3x</SelectItem>
                          <SelectItem value="4x">4x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    </div>
                    <div className="flex items-center gap-2">
                    <Button className="rounded-xl shadow-none bg-input/30" variant="secondary" size="sm">
                            <Mic className="size-4" />
                        </Button>
                    <Button className="rounded-xl shadow-none" variant="outline" size="sm">
                            Ask
                        </Button>
                        <Button className="rounded-xl shadow-none" size="sm">
                            Code
                        </Button>
                    </div>
                </div>
            </div>
      </div>
    </div>
  )
}