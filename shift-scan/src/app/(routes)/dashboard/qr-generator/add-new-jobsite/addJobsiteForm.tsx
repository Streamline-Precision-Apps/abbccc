import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { createJobsite } from "@/actions/jobsiteActions";



const AddJobsiteForm: React.FC<{}> = () => {


  return (
    <form action={createJobsite} className="space-y-4">
      <div>
        <label htmlFor="jobsite_name" className="block">
          Jobsite Name
        </label>
        <input
          id="jobsite_name"
          name="jobsite_name"
          type="text"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="street_number" className="block">
          Street Number
        </label>
        <textarea
          id="street_number"
          name="street_number"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="street_name" className="block">
          Street Name
        </label>
        <textarea
          id="street_name"
          name="street_name"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="city" className="block">
          City
        </label>
        <textarea
          id="city"
          name="city"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="state" className="block">
          State
        </label>
        <textarea
          id="state"
          name="state"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="country" className="block">
          Country
        </label>
        <textarea
          id="country"
          name="country"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="jobsite_description" className="block">
          Jobsite Description
        </label>
        <textarea
          id="jobsite_description"
          name="jobsite_description"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="jobsite_comments" className="block">
          Jobsite Comments
        </label>
        <textarea
          id="jobsite_comments"
          name="jobsite_comments"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <Buttons variant="green" size="default" type="submit">
        Submit
      </Buttons>
    </form>
  );
};

export default AddJobsiteForm;
