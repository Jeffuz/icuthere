"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "./ui/button";

const UserInfo = () => {

  return (
    <div className="flex flex-col justify-between">
      {/* Header */}
      <div className="bg-[#0078d4] text-white px-4 py-3 flex items-center justify-between border-b border-[#0078d4]">
        <div className="flex gap-3 flex-col justify-center">
          <div className="font-semibold">Patient Information</div>
        </div>
      </div>

      {/* Fields */}
      <div className="p-2 flex flex-col gap-y-2 border-x h-full">
        <div className="space-y-2 mb-4">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter patient's name" />
        </div>

        <div className="space-y-2 mb-4">
          <Label htmlFor="year">Year</Label>
          <Input id="year" placeholder="Year of birth or age" type="number" />
        </div>

        <div className="space-y-2 mb-4">
          <Label htmlFor="chiefComplaint">Chief Complaint</Label>
          <Textarea
            id="chiefComplaint"
            placeholder="Describe the main reason for the visit"
            rows={4}
          />
        </div>
      </div>
      <div className="p-3 border-x">
        <Button
          variant={"destructive"}
          className="w-full"
          onClick={() => window.location.reload()}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
