'use client'
import '@/app/globals.css';
import { Bases } from "@/components/(reusable)/bases";
import { Sections } from "@/components/(reusable)/sections";
import { Contents } from '@/components/(reusable)/contents';
import React , { act, useState } from 'react';
import { easeInOut, motion, MotionConfig } from "framer-motion";
import { Buttons } from '@/components/(reusable)/buttons';
import { Images } from '@/components/(reusable)/images';
import { easeIn } from "framer-motion"


export default function Testing() {
    
    return (
        <Bases>
            <Contents size={"default"}>
                <Sections size={"default"}>
                <AnimatedHamburgerButton />
                </Sections>
            </Contents>
        </Bases>  
    )
}

export function AnimatedHamburgerButton(){
    const [active, setActive] = useState(false);
    return (
        <div className=' flex flex-row-reverse'>
        <MotionConfig transition={{duration: .7}}>
        
        <motion.button
        animate={active ? "open" : "closed"} 
        onClick={() => setActive(!active)}
        className="relative right-0 h-20 w-20 m-2 rounded-full bg-white transition-colors"
        >
            <motion.span
            initial={false} 
            animate={active ? "open" : "closed"} 
            style={{
                left: "50%",
                top: "35%",
                x: "-50%",
                y: "-50%",
            }}
            className="absolute h-1 w-10 rounded-full bg-black"
            variants={{
                open: {
                    rotate: [0, 0, 45],
                    top: ["35%", "50%", "50%"],
                },
                closed: {
                    rotate: [45, 0, 0],
                    top: ["50%", "50%", "35%"],
                },
            }}
            />
            <motion.span
            initial={false} 
            animate={active ? "open" : "closed"} 
            style={{
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
            }} 
            className="absolute h-1 w-10 rounded-full bg-black"
            variants={{
                open: {
                    rotate: [0, 0, -45],
                },
                closed: {
                    rotate: [-45, 0, 0],
                },
            }}
            />
            <motion.span 
            initial={false} 
            animate={active ? "open" : "closed"}
            style={{
                left: "50%",
                bottom: "35%",
                x: "-50%",
                y: "50%",
            }}             
            className="absolute h-1 w-10 rounded-full bg-black"
            variants={{
                open: {
                    rotate: [0, 0, 45],
                    bottom: ["35%", "50%", "50%"],
                },
                closed: {
                    rotate: [45, 0, 0],
                    bottom: ["50%", "50%", "35%"],
                },
            }}
            />
        </motion.button>
        <motion.div
        initial={false} 
        animate={active ? "open" : "closed"}
        className='flex-row none items-center m-2 justify-between bg-white p-2 z-10 h-20 w-full'
        variants={{
            open: {
                opacity: [0, 0, .25, .5, 1],
                display: ["none", "flex", "flex", "flex", "flex"],
                width: ["0%","25%", "50%", "75%", "100%"],
            },
            closed: {
                opacity: [.5, 0],
                display: ["flex", "flex", "flex", "flex", "none"],
                width: ["100%", "50%", "0%"],
            },
        }}
        >
            <motion.div
            transition={{
                delay: 0.5,
            }}
            initial={false} 
            animate={active ? "open" : "closed"}
            variants={{
                open: {
                    opacity: [0, 0, .25, .5, 1],
                },
                closed: {
                    opacity: [.5, 0],
                },
            }}
            >
            <Buttons href="/hamburger/settings" variant={"icon"} size={"test"}>
              <Images titleImg={"/Settings.svg"} titleImgAlt={"settings"} variant={"icon"} size={"default"} />
            </Buttons>
            </motion.div>
            <motion.div
            transition={{
                delay: 0.4,
            }}
            initial={false} 
            animate={active ? "open" : "closed"}
            variants={{
                open: {
                    opacity: [0, 0, .25, .5, 1],
                },
                closed: {
                    opacity: [.5, 0],
                },
            }}
            >
            <Buttons href="/hamburger/inbox" variant={"icon"} size={"test"}>
              <Images titleImg={"/Inbox.svg"} titleImgAlt={"inbox"} variant={"icon"} size={"default"} />
            </Buttons>
            </motion.div>
            <motion.div
            transition={{
                delay: 0.3,
            }}
            initial={false} 
            animate={active ? "open" : "closed"}
            variants={{
                open: {
                    opacity: [0, 0, .25, .5, 1],
                },
                closed: {
                    opacity: [.5, 0],
                },
            }}
            >
            <Buttons href="/hamburger/profile" variant={"icon"} size={"test"}>
              <Images titleImg={"/profile.svg"} titleImgAlt={"profile"} variant={"icon"} size={"default"} />
            </Buttons>
            </motion.div>
            <motion.div
            transition={{
                delay: 0.2,
            }}
            initial={false} 
            animate={active ? "open" : "closed"}
            variants={{
                     open: {
                    opacity: [0, 0, .25, .5, 1],
                },
                closed: {
                    opacity: [.5, 0],
                },
            }}
            >
            <Buttons href="/admin" variant={"icon"} size={"test"}>
              <Images titleImg={"/forms.svg"} titleImgAlt={"Admin Page"} variant={"icon"} size={"default"} />
            </Buttons>
            </motion.div>
        </motion.div>
        </MotionConfig>
        </div>
    )
}