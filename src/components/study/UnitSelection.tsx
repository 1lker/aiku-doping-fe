// src/components/layout/UnitSelection.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Check, ChevronsUpDown, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Unit {
  value: string;
  label: string;
  learningOutcomes?: string[];
  pageNumbers?: number[];
}

interface UnitSelectionProps {
  units: Unit[];
  selectedUnits: string[];
  onSelectUnits: (units: string[]) => void;
  disabled?: boolean;
}

export const UnitSelection: React.FC<UnitSelectionProps> = ({
  units,
  selectedUnits,
  onSelectUnits,
  disabled
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <Layers className="h-6 w-6 text-blue-500" />
            <h2 className="text-lg font-semibold">Ünite Seçimi</h2>
          </div>

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
            <PopoverContent className="w-full p-0" align="start">
              <Command className="max-h-[300px]">
                <CommandInput placeholder="Ünite ara..." />
                <CommandEmpty>Ünite bulunamadı.</CommandEmpty>
                <CommandGroup>
                  <AnimatePresence>
                    {units.map((unit, index) => (
                      <motion.div
                        key={unit.value}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <CommandItem
                          onSelect={() => {
                            onSelectUnits(
                              selectedUnits.includes(unit.value)
                                ? selectedUnits.filter(x => x !== unit.value)
                                : [...selectedUnits, unit.value]
                            );
                          }}
                          className="py-2"
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Check
                              className={cn(
                                "h-4 w-4",
                                selectedUnits.includes(unit.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{unit.label}</div>
                              {(unit.learningOutcomes?.length ?? 0) > 0 && (
                                <div className="text-xs text-gray-500">
                                  {unit.learningOutcomes?.length} kazanım
                                </div>
                              )}
                            </div>
                            {unit.pageNumbers && (
                              <div className="text-xs text-gray-500">
                                Sayfa: {unit.pageNumbers.join(', ')}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedUnits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap gap-2"
            >
              {selectedUnits.map(unitValue => {
                const unit = units.find(u => u.value === unitValue);
                return (
                  <motion.div
                    key={unitValue}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                  >
                    {unit?.label}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};