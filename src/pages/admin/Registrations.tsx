import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { RegistrationCard } from "@/components/registration/RegistrationCard";
import { RegistrationsHeader } from "@/components/registration/RegistrationsHeader";
import { Registration } from "@/types/registration";

const registrations: Registration[] = [
  { 
    id: 1, 
    name: "Zain Abbas", 
    age: 25, 
    area: "Burton Central", 
    status: "Pending", 
    date: "2024-02-15",
    email: "zain@example.com",
    contact: "+44 7700 900777",
    address: "123 Central St, Burton",
    personalInfo: {
      fullName: "Zain Abbas",
      address: "123 Central St, Burton",
      town: "Burton",
      postCode: "DE14 1AA",
      email: "zain@example.com",
      mobile: "+44 7700 900777",
      dateOfBirth: "1999-05-15",
      placeOfBirth: "Burton",
      maritalStatus: "Single",
      gender: "Male"
    },
    nextOfKin: {
      name: "Sarah Abbas",
      address: "123 Central St, Burton",
      phone: "+44 7700 900888"
    },
    spouses: [],
    dependants: []
  },
  { 
    id: 2, 
    name: "Fatima Khan", 
    age: 30, 
    area: "Burton North", 
    status: "Pending", 
    date: "2024-02-14",
    email: "fatima@example.com",
    contact: "+44 7700 900888",
    address: "45 North Road, Burton"
  },
  { 
    id: 3, 
    name: "Ali Hassan", 
    age: 28, 
    area: "Burton South", 
    status: "Pending", 
    date: "2024-02-13",
    email: "ali@example.com",
    contact: "+44 7700 900999",
    address: "67 South Lane, Burton"
  },
];

export default function Registrations() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <RegistrationsHeader />

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search registrations..." 
            className="pl-8" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-220px)]">
        <div className="space-y-4">
          {registrations.map((registration) => (
            <RegistrationCard
              key={registration.id}
              registration={registration}
              isOpen={openItems.includes(registration.id)}
              onToggle={() => toggleItem(registration.id)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
