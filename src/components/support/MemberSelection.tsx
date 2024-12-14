import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";

interface Member {
  id: string;
  name: string;
  group: string;
}

const SAMPLE_MEMBERS: Member[] = [
  { id: "1", name: "John Doe", group: "Anjum Riaz Group" },
  { id: "2", name: "Jane Smith", group: "Zabbie Group" },
  { id: "3", name: "Alice Johnson", group: "Anjum Riaz Group" },
  { id: "4", name: "Bob Wilson", group: "Zabbie Group" },
];

interface MemberSelectionProps {
  selectedMembers: string[];
  setSelectedMembers: (members: string[]) => void;
}

export function MemberSelection({ selectedMembers, setSelectedMembers }: MemberSelectionProps) {
  const handleSelectAll = () => {
    if (selectedMembers.length === SAMPLE_MEMBERS.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(SAMPLE_MEMBERS.map(member => member.id));
    }
  };

  const handleMemberToggle = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="selectAll"
          checked={selectedMembers.length === SAMPLE_MEMBERS.length}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="selectAll">Select All Members</Label>
      </div>
      <ScrollArea className="h-[200px] rounded-md border p-4">
        <div className="space-y-4">
          {SAMPLE_MEMBERS.map((member) => (
            <div key={member.id} className="flex items-center space-x-2">
              <Checkbox
                id={member.id}
                checked={selectedMembers.includes(member.id)}
                onCheckedChange={() => handleMemberToggle(member.id)}
              />
              <Label htmlFor={member.id}>
                {member.name} ({member.group})
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}