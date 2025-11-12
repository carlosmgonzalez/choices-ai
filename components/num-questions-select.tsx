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

export function NumQuestionsSelect() {
  const { numQuestions, setNumQuestions } = useGlobalStore();

  return (
    <Select
      onValueChange={(value) => {
        setNumQuestions(parseInt(value));
      }}
      value={numQuestions?.toString() ?? "20"}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Número de preguntas" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cantidad</SelectLabel>
          <SelectItem value="5">5 preguntas</SelectItem>
          <SelectItem value="10">10 preguntas</SelectItem>
          <SelectItem value="15">15 preguntas</SelectItem>
          <SelectItem value="20">20 preguntas</SelectItem>
          <SelectItem value="30">30 preguntas</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
