import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button } from 'reactstrap';
import mammoth from 'mammoth';
const TermsOfUse = ({ isOpen, toggleModal, docxFile }) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (docxFile) {
            fetch(docxFile)
                .then((response) => response.arrayBuffer())
                .then((arrayBuffer) => {
                    mammoth.convertToHtml({ arrayBuffer })
                        .then((result) => setContent(result.value))
                        .catch((err) => console.error('Error parsing DOCX:', err));
                })
                .catch((error) => console.error('Error fetching DOCX file:', error));
        }
    }, [docxFile]);


    return (
        <Modal isOpen={isOpen} toggle={toggleModal} size='lg'>
            <ModalBody>
                <div
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            </ModalBody>
            <Button color="secondary" onClick={toggleModal}>Close</Button>
        </Modal>
    );
};

export default TermsOfUse;
