import React, { useState } from 'react'
import styled from 'styled-components'

interface QuestionModalProps {
  onSubmit: (answer: string) => void
  onClose: () => void
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`

const Input = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
`

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;

  &:hover {
    background-color: #0056b3;
  }
`

const QuestionModal: React.FC<QuestionModalProps> = ({ onSubmit, onClose }) => {
  const [answer, setAnswer] = useState('')

  const handleSubmit = () => {
    onSubmit(answer)
    setAnswer('')
  }

  return (
    <ModalOverlay>
      <ModalContent>
        <h2>Answer the Question</h2>
        <Input type="text" placeholder="Enter your answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <div>
          <Button onClick={handleSubmit}>Submit</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </ModalContent>
    </ModalOverlay>
  )
}

export default QuestionModal

