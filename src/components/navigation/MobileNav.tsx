import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Link2Icon, InfoIcon, Stethoscope } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export const MobileNav = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleNavigation = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] sm:w-[385px] p-0">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Menu
            </span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleNavigation("/terms")}
            >
              <Link2Icon className="h-4 w-4" />
              Terms
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleNavigation("/collector-responsibilities")}
            >
              <InfoIcon className="h-4 w-4" />
              Collector Info
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => handleNavigation("/medical-examiner-process")}
            >
              <Stethoscope className="h-4 w-4" />
              Medical Process
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}