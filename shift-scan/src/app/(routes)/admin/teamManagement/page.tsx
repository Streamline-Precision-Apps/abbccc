// import prisma from "@/lib/prisma";
// import { cookies } from "next/headers";
// import TeamManagementContent from "./content";
// import { auth } from "@/auth";
// import { SearchUser } from "@/lib/types";

// export default async function AdminDashboard() {
//   const session = await auth();
//   const userId = session?.user.id;

//   const User = await prisma.users.findUnique({
//     where: {
//       id: userId,
//     },
//     select: {
//       permission: true,
//     },
//   });

//   const users: SearchUser[] = await prisma.users.findMany({
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       username: true,
//       permission: true,
//       DOB: true,
//       truckView: true,
//       mechanicView: true,
//       laborView: true,
//       tascoView: true,
//       image: true,
//     },
//   });

//   return <TeamManagementContentContent permission={User?.permission} users={users} />;
// }

"use client";
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { DotsVerticalIcon } from '@heroicons/react/outline';

const initialCards = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Sam Johnson' },
];

export default function Home() {
  const [columns, setColumns] = useState({
    box1: {
      name: 'Box 1',
      items: initialCards,
    },
    box2: {
      name: 'Box 2',
      items: [],
    },
  });

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);

      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    }
  };

  const duplicateCard = (columnId, card) => {
    const column = columns[columnId];
    const newItems = [...column.items, { ...card, id: Date.now().toString() }];
    setColumns({
      ...columns,
      [columnId]: { ...column, items: newItems },
    });
  };

  const deleteCard = (columnId, cardId) => {
    const column = columns[columnId];
    const newItems = column.items.filter((card) => card.id !== cardId);
    setColumns({
      ...columns,
      [columnId]: { ...column, items: newItems },
    });
  };

  return (
    <div className="flex space-x-4 p-8">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column], index) => (
          <div key={columnId} className="w-1/2 p-4 bg-gray-100 rounded">
            <h2 className="text-lg font-bold mb-4">{column.name}</h2>
            <Droppable droppableId={columnId}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`p-4 bg-white rounded shadow-md min-h-[200px] ${
                    snapshot.isDraggingOver ? 'bg-blue-50' : ''
                  }`}
                >
                  {column.items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex justify-between items-center p-4 mb-2 bg-gray-200 rounded"
                        >
                          <span>{item.name}</span>
                          <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="flex items-center justify-center">
                              <DotsVerticalIcon className="w-5 h-5" />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 w-32 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => duplicateCard(columnId, item)}
                                        className={`${
                                          active ? 'bg-gray-100' : ''
                                        } group flex items-center w-full px-4 py-2 text-sm`}
                                      >
                                        Duplicate
                                      </button>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() => deleteCard(columnId, item.id)}
                                        className={`${
                                          active ? 'bg-gray-100' : ''
                                        } group flex items-center w-full px-4 py-2 text-sm`}
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
