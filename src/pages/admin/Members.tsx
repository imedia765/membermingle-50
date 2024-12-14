import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronDown, 
  MessageSquare, 
  TrashIcon,
  Eye,
  Users,
  Pencil,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoveredMembersOverview } from "@/components/members/CoveredMembersOverview";
import { MembersHeader } from "@/components/members/MembersHeader";
import { MembersSearch } from "@/components/members/MembersSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const members = [
  { 
    id: 1, 
    name: "John Doe", 
    membershipNo: "M001", 
    status: "Active", 
    joinDate: "2023-01-15",
    paymentHistory: [
      { date: "2024-01-01", amount: 50, status: "Paid" },
      { date: "2023-12-01", amount: 50, status: "Paid" },
      { date: "2023-11-01", amount: 50, status: "Paid" },
    ],
    adminNotes: "Regular payment history. Active member since 2023.",
    email: "john@example.com",
    phone: "+44 7700 900123",
    address: "123 Main St, Burton",
    coveredMembers: {
      spouses: [
        { name: "Jane Doe", dateOfBirth: "1985-06-15" }
      ],
      dependants: [
        { name: "Jimmy Doe", dateOfBirth: "2010-03-20", relationship: "Son" },
        { name: "Jenny Doe", dateOfBirth: "2012-08-10", relationship: "Daughter" }
      ]
    }
  },
  // ... more members
];

export default function Members() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState<number | null>(null);

  const toggleMember = (memberId: number) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  return (
    <div className="space-y-6">
      <MembersHeader />
      <MembersSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CoveredMembersOverview members={members} />

      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {members.map((member) => (
            <Card key={member.id} className="overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMember(member.id)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {member.membershipNo} - {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Status: {member.status} | Joined: {member.joinDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Family Members</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Covered Members</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {member.coveredMembers?.spouses?.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-sm font-semibold">Spouse</div>
                          {member.coveredMembers.spouses.map((spouse, index) => (
                            <div key={index} className="px-2 py-1.5 text-sm">
                              {spouse.name}
                              <div className="text-xs text-muted-foreground">
                                Born: {spouse.dateOfBirth}
                              </div>
                            </div>
                          ))}
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {member.coveredMembers?.dependants?.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-sm font-semibold">Dependants</div>
                          {member.coveredMembers.dependants.map((dependant, index) => (
                            <div key={index} className="px-2 py-1.5 text-sm">
                              {dependant.name}
                              <div className="text-xs text-muted-foreground">
                                {dependant.relationship} | Born: {dependant.dateOfBirth}
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                      {(!member.coveredMembers?.spouses?.length && !member.coveredMembers?.dependants?.length) && (
                        <div className="px-2 py-1.5 text-sm text-muted-foreground">
                          No family members registered
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {expandedMember === member.id && (
                <CardContent className="border-t">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Contact Information</h4>
                      <p className="text-sm">Email: {member.email}</p>
                      <p className="text-sm">Phone: {member.phone}</p>
                      <p className="text-sm">Address: {member.address}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Payment History</h4>
                      <div className="space-y-2">
                        {member.paymentHistory.map((payment, index) => (
                          <div key={index} className="text-sm flex justify-between">
                            <span>{payment.date}</span>
                            <span>£{payment.amount}</span>
                            <span className="text-green-500">{payment.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Admin Notes</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingNotes(editingNotes === member.id ? null : member.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        {editingNotes === member.id ? "Save Notes" : "Edit Notes"}
                      </Button>
                    </div>
                    {editingNotes === member.id ? (
                      <Textarea 
                        defaultValue={member.adminNotes}
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{member.adminNotes}</p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
