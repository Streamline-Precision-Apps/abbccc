// "use client";
// import { Buttons } from "@/components/(reusable)/buttons";
// import { Contents } from "@/components/(reusable)/contents";
// import { Forms } from "@/components/(reusable)/forms";
// import { Images } from "@/components/(reusable)/images";
// import { Inputs } from "@/components/(reusable)/inputs";
// import { Labels } from "@/components/(reusable)/labels";
// import { Holds } from "@/components/(reusable)/holds";
// import { Selects } from "@/components/(reusable)/selects";
// import { TextAreas } from "@/components/(reusable)/textareas";
// import { Titles } from "@/components/(reusable)/titles";
// import { useEffect, useState } from "react";
// import { createLeaveRequest } from "@/actions/inboxSentActions";
// import { useRouter } from "next/navigation";
// import React from "react";
// import { Grids } from "@/components/(reusable)/grids";
// import { z } from "zod";
// import { useSession } from "next-auth/react";

// // Zod schema for form validation
// const leaveRequestSchema = z.object({
//   startDate: z.string().nonempty({ message: "Start date is required" }),
//   endDate: z.string().nonempty({ message: "End date is required" }),
//   requestType: z.enum(["Vacation", "Medical", "Military", "Personal", "Sick"]),
//   description: z.string().max(40, { message: "Max 40 characters" }),
//   userId: z.string().nonempty({ message: "User ID is required" }),
//   status: z.literal("PENDING"),
//   date: z.string().nonempty({ message: "Date is required" }),
// });

// export const CreateRequest = () => {
//   const [sign, setSign] = useState(false);
//   const [message, setMessage] = useState("");
//   const [closeBanner, setCloseBanner] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();
//   const [signature, setSignature] = useState("");
//   const { data: session } = useSession();

//   // Fetch the signature image when the component is mounted
//   useEffect(() => {
//     const fetchSignature = async () => {
//       const response = await fetch("/api/getUserSignature");
//       const json = await response.json();
//       setSignature(json.signature);
//     };
//     fetchSignature();
//   }, []);

//   // Handle form submission
//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     if (!sign) {
//       setErrorMessage("Please provide your signature before submitting.");
//       return;
//     }

//     const formData = new FormData(event.target as HTMLFormElement);
//     const formValues = {
//       startDate: formData.get("startDate") as string,
//       endDate: formData.get("endDate") as string,
//       requestType: formData.get("requestType") as string,
//       description: formData.get("description") as string,
//       userId: formData.get("userId") as string,
//       status: formData.get("status") as string,
//       date: formData.get("date") as string,
//     };

//     // Validate form data using Zod
//     try {
//       leaveRequestSchema.parse(formValues);
//       await createLeaveRequest(formData);

//       setCloseBanner(true);
//       setMessage("Time off request submitted");

//       // Redirect and reset form after a delay
//       const timer = setTimeout(() => {
//         setCloseBanner(false);
//         setMessage("");
//         clearTimeout(timer);
//         router.replace("/hamburger/inbox");
//       }, 5000);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         setErrorMessage(error.errors[0].message);
//       } else {
//         console.error("Error creating leave request:", error);
//       }
//     }
//   };

//   return (
//     <Holds className="h-full ">
//       {/* Display banner message */}
//       {closeBanner && <Titles>{message}</Titles>}

//       {/* Display error message if not signed */}
//       {errorMessage && <Titles>{errorMessage}</Titles>}

//       <Forms onSubmit={handleSubmit} className="h-full ">
//         <Holds className="mb-5 h-full">
//           <Holds
//             background={"green"}
//             className="border-[3px] border-black rounded-b-none h-[15%] flex items-center justify-center"
//           >
//             <Titles className="">Request</Titles>
//           </Holds>
//           <Holds
//             background={"white"}
//             className="border-[3px] h-full p-3 rounded-t-none border-black"
//           >
//             <Contents width="section">
//               <Grids rows={"7"} gap={"5"}>
//                 <Holds className="row-span-6 h-full ">
//                   <Grids rows={"2"} className="">
//                     <Holds position={"row"} className="space-x-4">
//                       <Labels>
//                         Start Date
//                         <Inputs
//                           type="date"
//                           name="startDate"
//                           id="startDate"
//                           required
//                         />
//                       </Labels>
//                       <Labels>
//                         End Date
//                         <Inputs
//                           type="date"
//                           name="endDate"
//                           id="endDate"
//                           required
//                         />
//                       </Labels>
//                     </Holds>
//                     <Holds position={"row"} className="space-x-4">
//                       <Holds className="h-full">
//                         <Labels>
//                           Request Type
//                           <Selects
//                             id="requestType"
//                             name="requestType"
//                             defaultValue=""
//                             required
//                           >
//                             <option value="">Choose a request</option>
//                             <option value="Vacation">Vacation</option>
//                             <option value="Medical">
//                               Family/Medical Leave
//                             </option>
//                             <option value="Military">Military Leave</option>
//                             <option value="Personal">
//                               Non Paid Personal Leave
//                             </option>
//                             <option value="Sick">Sick Time</option>
//                           </Selects>
//                         </Labels>
//                       </Holds>
//                       <Holds className="h-full">
//                         <Labels>
//                           Comments
//                           <TextAreas
//                             name="description"
//                             id="description"
//                             rows={3}
//                             maxLength={40}
//                             required
//                           />
//                         </Labels>
//                       </Holds>
//                       <Inputs
//                         type="hidden"
//                         name="userId"
//                         value={session?.user?.id}
//                       />
//                       <Inputs type="hidden" name="status" value="PENDING" />
//                       <Inputs
//                         type="hidden"
//                         name="date"
//                         value={new Date().toISOString()}
//                       />
//                     </Holds>
//                   </Grids>
//                 </Holds>
//                 <Holds position={"row"} className="row-span-1 h-full gap-5 ">
//                   {/* Signature Section */}
//                   <Holds className="row-span-1 h-full">
//                     {sign ? (
//                       <Buttons
//                         background={"lightBlue"}
//                         onClick={(event) => {
//                           event.preventDefault();
//                           setSign(false);
//                           setErrorMessage("");
//                         }}
//                       >
//                         <Holds>
//                           <Images
//                             titleImg={`${signature}`}
//                             titleImgAlt="Loading Signature"
//                             size={"50"}
//                             className="m-auto my-2 "
//                           />
//                         </Holds>
//                       </Buttons>
//                     ) : (
//                       <Buttons
//                         background={"lightBlue"}
//                         className="flex justify-center items-center"
//                         onClick={(event) => {
//                           event.preventDefault();
//                           setSign(true);
//                         }}
//                       >
//                         <Titles size={"h3"}>Sign Here</Titles>
//                       </Buttons>
//                     )}
//                   </Holds>
//                   {/* Submit Section */}
//                   <Holds className="row-span-1 h-full">
//                     <Buttons
//                       type="submit"
//                       background={"green"}
//                       disabled={!sign}
//                     >
//                       <Titles size={"h2"}>Submit</Titles>
//                     </Buttons>
//                   </Holds>
//                 </Holds>
//               </Grids>
//             </Contents>
//           </Holds>
//         </Holds>
//       </Forms>
//     </Holds>
//   );
// };
