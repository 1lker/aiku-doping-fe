// src/components/flashcards/unit-selector.tsx

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { courses } from '@/data/courseData';

interface UnitSelectorProps {
  selectedCourse: string;
  selectedUnits: string[];
  onSelectUnits: (units: string[]) => void;
  disabled?: boolean;
}

export const UnitSelector: React.FC<UnitSelectorProps> = ({
  selectedCourse,
  selectedUnits,
  onSelectUnits,
  disabled = false
}) => {
  const [open, setOpen] = React.useState(false);

  const courseUnits = React.useMemo(() => {
    const course = courses.find(c => c.value === selectedCourse);
    return course?.units || [];
  }, [selectedCourse]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Üniteler
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-disabled={disabled}
            className={cn(
              "w-full justify-between",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            {selectedUnits.length > 0
              ? `${selectedUnits.length} ünite seçildi`
              : "Ünite seçiniz..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Ünite ara..." />
            <CommandEmpty>Ünite bulunamadı.</CommandEmpty>
            <CommandGroup>
              {courseUnits.map((unit) => (
                <CommandItem
                  key={unit.value}
                  onSelect={() => {
                    onSelectUnits(
                      selectedUnits.includes(unit.value)
                        ? selectedUnits.filter(x => x !== unit.value)
                        : [...selectedUnits, unit.value]
                    );
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedUnits.includes(unit.value) 
                        ? "opacity-100" 
                        : "opacity-0"
                    )}
                  />
                  {unit.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};