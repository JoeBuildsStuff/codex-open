"use client"

import { useId, useState } from "react"
import { CheckIcon, ChevronDownIcon, PlusIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectSearchButtonProps {
  options: SelectOption[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  buttonText?: string
  buttonIcon?: React.ReactNode
  onButtonClick?: () => void
  showButton?: boolean
  label?: string
  className?: string
  buttonClassName?: string
}

export default function SelectSearchButton({
  options,
  value = "",
  onValueChange,
  placeholder = "Select option",
  searchPlaceholder = "Find option",
  emptyMessage = "No option found.",
  buttonText = "New option",
  buttonIcon = <PlusIcon size={16} className="-ms-2 opacity-60" aria-hidden="true" />,
  onButtonClick,
  showButton = true,
  label,
  className = "",
  buttonClassName = "bg-background hover:bg-background border-input w-full justify-between px-3 font-normal outline-offset-0 outline-none focus-visible:outline-[3px]",
}: SelectSearchButtonProps) {
  const id = useId()
  const [open, setOpen] = useState<boolean>(false)
  const [selectedValue, setSelectedValue] = useState<string>(value)

  const handleValueChange = (newValue: string) => {
    const finalValue = newValue === selectedValue ? "" : newValue
    setSelectedValue(finalValue)
    onValueChange?.(finalValue)
    setOpen(false)
  }

  const selectedOption = options.find(option => option.value === selectedValue)

  return (
    <div className={cn("*:not-first:mt-2", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={buttonClassName}
          >
            <span className={cn("truncate", !selectedValue && "text-muted-foreground")}>
              {selectedValue
                ? selectedOption?.label
                : placeholder}
            </span>
            <ChevronDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0 rounded-2xl"
          align="start"
        >
          <Command className="rounded-2xl">
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleValueChange}
                  >
                    {option.label}
                    {selectedValue === option.value && (
                      <CheckIcon size={16} className="ml-auto" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              {showButton && onButtonClick && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start font-normal rounded-xl rounded-t-none"
                      onClick={onButtonClick}
                    >
                      {buttonIcon}
                      {buttonText}
                    </Button>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
