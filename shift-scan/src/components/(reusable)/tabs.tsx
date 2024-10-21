"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import React from "react";
import { useState } from "react";
import { Tab } from "@/components/(reusable)/tab";
import { Holds } from "../(reusable)/holds";
import { Buttons } from "../(reusable)/buttons";
import { Contents } from "./contents";
import { Titles } from "./titles";
import { Expands } from "./expands";
import { Forms } from "./forms";
import { Labels } from "./labels";
import { Inputs } from "./inputs";

const TabVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      variant: {
        default: "",
        green: "bg-green-500",
        red: "bg-red-500",
      },
      size: {
        default: "",
        sm: "p-2 w-30 h-30",
        med: "p-10 w-40 h-40",
        lg: "p-10 w-50 h-50",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface TabProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof TabVariants> {}

const Tabs: FC<TabProps> = ({ className, variant, size, ...props }) => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className={cn(TabVariants({ variant, size, className }))} {...props}>
      <div className="py-4 max-w[400px]">
        <div className="flex gap-2">
          <Tab
            onClick={() => setActiveTab(1)}
            tabLabel="Equipment"
            isTabActive={activeTab === 1}
          />
          <Tab
            onClick={() => setActiveTab(2)}
            tabLabel="Cost Codes"
            isTabActive={activeTab === 2}
          />
          <Tab
            onClick={() => setActiveTab(3)}
            tabLabel="Employees"
            isTabActive={activeTab === 3}
          />
        </div>
        <Holds>
          {activeTab === 1 && (
            <Contents>
              <Expands title="Current Equipment" divID="1">
                <Titles>Example 1</Titles>
                <Forms>
                  <Labels>Label 1</Labels>
                  <Inputs></Inputs>
                  <Buttons>Button 1</Buttons>
                </Forms>
              </Expands>
              <Expands title="Edit Equipment" divID="2">
                <Titles>Example 2</Titles>
                <Forms>
                  <Labels>Label 2</Labels>
                  <Inputs></Inputs>
                  <Buttons>Button 2</Buttons>
                </Forms>
              </Expands>
              <Expands title="Add Equipment" divID="3">
                <Titles>Example 3</Titles>
                <Forms>
                  <Labels>Label 3</Labels>
                  <Inputs></Inputs>
                  <Buttons>Button 3</Buttons>
                </Forms>
              </Expands>
            </Contents>
          )}
          {activeTab === 2 && <p>Example 2</p>}
          {activeTab === 3 && <p>Example 3</p>}
        </Holds>
      </div>
    </div>
  );
};

export { Tabs, TabVariants };
