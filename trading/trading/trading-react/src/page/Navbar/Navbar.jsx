import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon
} from '@radix-ui/react-icons';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from './Sidebar';
import { useSelector } from 'react-redux';

function Navbar() {
  const auth = useSelector((store) => store.auth);

  return (
    <div className="px-4 py-3 border-b z-50 bg-background sticky top-0 left-0 right-0 flex justify-between items-center">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Sidebar Trigger - always visible */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-11 w-11"
            >
              <DragHandleHorizontalIcon className="h-7 w-7" />
            </Button>
          </SheetTrigger>

          <SheetContent
            className="w-72 border-r-0 flex flex-col justify-center"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>
                <div className="text-3xl flex justify-center items-center gap-2">
                  <Avatar>
                    <AvatarImage
                      src="https://cdn.pixabay.com/photo/2021/04/30/16/47/binance-logo-6219389_1280.png"
                      alt="Logo"
                    />
                    <AvatarFallback>ZT</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-orange-700">Zosh</span>
                    <span className="text-base text-muted-foreground">Trade</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>

            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* App Title */}
        <p className="text-sm lg:text-base font-medium cursor-pointer hidden sm:inline-block">
          Zosh Trading
        </p>

        {/* Search Button */}
        <div className="ml-4 hidden md:block">
          <Button variant="outline" className="flex items-center gap-2">
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </div>
      </div>

      {/* Right Section - Avatar */}
      <div>
        <Avatar>
          <AvatarImage src={auth.user?.avatar} alt="User Avatar" />
          <AvatarFallback>
            {auth.user?.fullName?.[0]?.toUpperCase() || "Z"}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default Navbar;
