import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface Props {
  data: {
    id: string;
    question: string;
    choices: string[];
    correctChoice: string;
    explanation: string;
    meta: {
      difficulty: "easy" | "medium" | "hard";
    };
  };
}

export function Question({ data }: Props) {
  return (
    <div key={data.id} className="flex flex-col gap-2">
      <p>{data.question}</p>
      {data.choices.map((c, i) => {
        return (
          <div key={`${c}-${i}`} className="flex flex-row gap-2 items-center">
            <Checkbox id={c} onCheckedChange={() => console.log("checked")} />
            <Label htmlFor={c}>{c}</Label>
          </div>
        );
      })}
    </div>
  );
}
