import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Member } from "@/components/members/types";

const SAMPLE_MEMBERS: Partial<Member>[] = [
  { id: "1", full_name: "John Doe", collector: "Anjum Riaz Group" },
  { id: "2", full_name: "Jane Smith", collector: "Zabbie Group" },
  { id: "3", full_name: "Alice Johnson", collector: "Anjum Riaz Group" },
  { id: "4", full_name: "Bob Wilson", collector: "Zabbie Group" },
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
      setSelectedMembers(SAMPLE_MEMBERS.map(member => member.id!));
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
                checked={selectedMembers.includes(member.id!)}
                onCheckedChange={() => handleMemberToggle(member.id!)}
              />
              <Label htmlFor={member.id}>
                {member.full_name} ({member.collector})
              </Label>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}