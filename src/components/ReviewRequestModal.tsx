import { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure ,Checkbox} from "@nextui-org/react";
import {spaceApi} from '../services/space'
import { Request } from "./notificationToast";


export default function Review({request}: {request:Request|null}) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [requestStatus , setRequestStatus] = useState<boolean>(false)
  const [isSelected , setIsSelected] = useState<boolean>(false)

  const [triggerAcceptOrReject , _res] = spaceApi.endpoints.acceptOrRejectRequest.useLazyQuery()

  const handleSubmit = ()=>{
        console.log('sending request...')
        if(request)
        triggerAcceptOrReject({
            requestId:request.id,
            body:{
                state:requestStatus ? "accepted" : "rejected",
                permission:isSelected
            }
        })
  }
  useEffect(()=>{
    console.log(requestStatus)
  } , [requestStatus])

  return (
    <>
      <Button onPress={onOpen} color="secondary">Review Request</Button>
      <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                radius="lg"
                classNames={{
                    body: "py-6",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                    base: "border-[#292f46] bg-[#ffffff] dark:bg-[#19172c] text-[#a8b0d3]",
                    header: "border-b-[1px] border-[#292f4699]",
                    footer: "border-t-[1px] border-[#292f4699]",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                }}
            >
                <ModalContent>
                    {(onClose) => (
                    <>{request && request.notif_type == 0 &&
                        <ModalHeader className="flex flex-col gap-1">{request.from_user.username}'s Request</ModalHeader>
                        }
                        {request && request.notif_type == 1 &&

                        <ModalHeader className="flex flex-col gap-1">{request.from_user.username}'s Has request to edit File</ModalHeader>
                        
                        }
                        <ModalBody>
                                <Checkbox isSelected={requestStatus} onValueChange={()=>setRequestStatus(true)} className="text-white">Accept</Checkbox>
                                <Checkbox isSelected={!requestStatus} onValueChange={()=>setRequestStatus(false)} className="text-white">Reject</Checkbox>
                                <Checkbox isSelected={isSelected} onValueChange={setIsSelected} className="text-white">Can Edit File</Checkbox>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="bg-[#6f4ef2] shadow-lg shadow-indigo-500/20 text-white" onClick={handleSubmit} onPress={onClose}>
                                    Submit
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
    </>
  );
}
