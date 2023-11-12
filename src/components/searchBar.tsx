import { useDisclosure, Input,Modal, ModalBody,  Spinner, Card, CardBody, Button, ModalHeader, ModalContent } from "@nextui-org/react"
import { useState , useEffect } from "react"
import { documentApi } from "../services/file";
import { Bug, SearchIcon } from "lucide-react";
import useThrottle from "../hooks/throttle";
import Highlighter from "react-highlight-words";



const Search = () =>{
  

  const [triggerSearch, searchResults] = documentApi.endpoints.searchQuery.useLazyQuery();

  
  const [search , setSearch] = useState<string>("");
  const {isOpen , onOpen , onOpenChange} = useDisclosure()

    const throttledSearch = useThrottle(() => {
        triggerSearch(search);
    }, 500);

    useEffect(() => {
        if (search !== '') throttledSearch();
    }, [search]);
  
  const handleSearchResultPress = (searchResponse: any) => {
        window.location.replace(`http://localhost:5174/space/${searchResponse.space}/document/${searchResponse.docId}`);
        onOpenChange();
    };

  return (
    <>       <Input
          classNames={{
            base: "max-w-full sm:max-w-[10rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          onClick={onOpen}
      
        />
    <Modal size="full"isOpen={isOpen} onOpenChange={onOpenChange}>        
      <ModalContent>         
        {
            ///@ts-ignore
            (onClose)=>(
                <ModalBody>
                    <Input
                        classNames={{
                            base: 'max-w-full h-15',
                            mainWrapper: 'h-full',
                            input: 'text-base',
                            inputWrapper: 'h-full font-normal mt-10 text-lg text-default-500 bg-default-400/20 dark:bg-default-500/20',
                        }}
                        placeholder='Type to search...'
                        size='sm'
                        startContent={<SearchIcon size={18} />}
                        type='search'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div>
                        {searchResults.error ? (
                            <>Some Error Occurred</>
                        ) : searchResults.isLoading ? (
                            <div className='w-full h-full flex justify-center items-center'><Spinner color='secondary' /></div>
                        ) : (searchResults.data?.length ? (
                            searchResults.data?.map((searchResponse) => (
                                <Card
                                    key={searchResponse.docId}
                                    className='h-max-[100px] overflow-hidden'
                                    isPressable
                                    onPress={() => handleSearchResultPress(searchResponse)}
                                >
                                    <CardBody className='h-max-[100px]'>
                                        <div className='text-lg font-bold'>
                                            <Highlighter
                                                highlightClassName='bg-purple-500 font-bold'
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={searchResponse.heading}
                                            />
                                        </div>
                                        <div className='text-sm h-10 font-light'>
                                            <Highlighter
                                                highlightClassName='bg-purple-500 font-bold'
                                                searchWords={[search]}
                                                autoEscape={true}
                                                textToHighlight={searchResponse.text}
                                            />
                                        </div>
                                    </CardBody>
                                </Card>
                            ))):(
                          <div className="w-full h-full flex justify-center items-center">
                              <Spinner color="secondary" />
                          </div>
                        )
                    )}
                    </div>
                </ModalBody>
   
            )}</ModalContent>
                 </Modal>
        </>
  )
}


export default Search;
