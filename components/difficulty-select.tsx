"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGlobalStore } from "@/store/global.store";

export function DifficultySelect() {
  const { difficulty, setDifficulty } = useGlobalStore();

  return (
    <Select
      onValueChange={(value) => {
        setDifficulty(value as "easy" | "medium" | "hard");
      }}
      value={difficulty}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Dificultad" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Dificultad</SelectLabel>
          <SelectItem value="easy">
            <div className="flex items-center gap-2">
              <span className="text-green-500">●</span>
              <span>Fácil</span>
            </div>
          </SelectItem>
          <SelectItem value="medium">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">●</span>
              <span>Medio</span>
            </div>
          </SelectItem>
          <SelectItem value="hard">
            <div className="flex items-center gap-2">
              <span className="text-red-500">●</span>
              <span>Difícil</span>
            </div>
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
