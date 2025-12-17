"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CaseStudy } from "@/components/sections/case-study";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ConfiguratorDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Configurator</Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl p-0">
        <div className="p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle>Project configurator</DialogTitle>
            <DialogDescription>Adjust scope to see timeline and budget react.</DialogDescription>
          </DialogHeader>

          <div className="mt-5 max-h-[70vh] overflow-y-auto pr-1">
            <CaseStudy variant="panel" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
