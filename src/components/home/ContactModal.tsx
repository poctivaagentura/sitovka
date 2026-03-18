import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { ContactModalCard } from "./ContactModalCard";

interface Person {
  name: string;
  role?: string;
  email?: string;
  phone?: string;
  avatar?: any;
}

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  people: Person[];
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onOpenChange,
  people,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-md z-[1000]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-[1001] flex items-center justify-center p-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ pointerEvents: "none" }}
              >
                <div className="relative bg-white rounded-[30px] p-8 shadow-xl w-full max-w-full sm:max-w-[750px] max-h-[90vh] overflow-y-auto mx-auto pointer-events-auto">
                  {/* Close Button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute top-4 right-4 inline-flex items-center justify-center rounded-full w-10 h-10 text-brand-dark hover:bg-brand-surface transition-colors cursor-pointer z-10"
                      aria-label="Zavřít"
                    >
                      <svg
                        width="25"
                        height="25"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </Dialog.Close>

                  {/* Contact Cards Grid - Flexible layout based on count */}
                  <div className="flex flex-wrap justify-center gap-6">
                    {people.map((person, index) => (
                      <ContactModalCard
                        key={`${person.name}-${index}`}
                        person={person}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

ContactModal.displayName = "ContactModal";
