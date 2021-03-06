import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSpring, animated } from 'react-spring';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md';
import '../App.css'
import Draggable, {} from 'react-draggable';

const Background = styled.div`
  width: 100%;
  height: 100%;
  // background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalWrapper = styled.div`
  width: 800px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

// const ModalImg = styled.img`
//   width: 100%;
//   height: 100%;
//   border-radius: 10px 0 0 10px;
//   background: #000;
// `;

const ModalContent = styled.div`
  display: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width : 150%;
  height : 100%;
  align-self : center;
  line-height: 1.8;
  color: #141414;

  p {
    margin-bottom: 1rem;
  }

  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
`;

const CloseModalButton = styled(MdClose)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;

export const ContextModal = ({ showModal, setShowModal, addOrEdit, currentId, contactObjects }) => {
  const modalRef = useRef();

  const animation = useSpring({
    config: {
      duration: 0
    },
    opacity: showModal ? 1 : 0,
    transform: showModal ? `translate(-180%, -50%)` : `translate(-100%,-100%)`
    // transform: showModal ? `translateY(0%)` : `translateY(-100%)`
  });

  const closeModal = e => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    e => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
        console.log('I pressed');
      }
    },
    [setShowModal, showModal]
  );

  useEffect(
    () => {
      document.addEventListener('keydown', keyPress);
      return () => document.removeEventListener('keydown', keyPress);
    },
    [keyPress]
  );

  const initialFieldValues = {
    fullName : '',
    mobile : '',
    email : '',
    address : '',
    commit : ''
  }

  var [values, setValues] = useState(initialFieldValues)

  const handleInputChange = e => {
      var { name, value} = e.target
      setValues({
          ...values,
          [name] : value
      })
  }

  const handleFormSubmit = e => {
    if(values.fullName == '') {
      alert("제목을 입력하세요")
      e.preventDefault();
    }
    else if(values.mobile == '') {
      alert("비밀번호를 입력하세요")
      e.preventDefault();
    }
    else if(values.address == '') {
      alert("내용을 입력하세요")
      e.preventDefault();
    }
    else {
      if(window.confirm("글을 쓸 경우 수정이 불가능합니다. 계속 하시겠습니까?")){
        e.preventDefault();
        // aria-label='Close modal'
        addOrEdit(values);
        alert("글 쓰기 완료");
        setShowModal(prev => !prev)
        setValues({})
      }
    }
  }

  return (
    <>
      {showModal ? (
        <Draggable>
          <Background onClick={closeModal} ref={modalRef}>
            <animated.div style={animation}>
              <ModalWrapper showModal={showModal}>
                {/* <ModalImg src={require('./modal.jpg')} alt='camera' /> */}
                <ModalContent>
                  {/* <h1>Are you ready?</h1>
                  <p>Get exclusive access to our next launch.</p>
                  <button>Join Now</button> */}
                  <div>
                    <form className="addform" autoComplete="off" onSubmit={handleFormSubmit}>
                        <div className="form-group input-group">
                            {/* <div className="input-group-prepend">
                                <div className="input-group-text">
                                    <i className="fas fa-user"></i>
                                </div>
                            </div> */}
                            <text className="formtext">제목</text>
                            <input className="addtext" name="fullName" value={values.fullName} onChange={handleInputChange}/>
                        </div>
                        <div className="form-row">
                            <div className="form-group input-group col-md-6">
                                {/* <div className="input-group-prepend">
                                    <div className="input-group-text">
                                        <i className="fas fa-mobile-alt"></i>
                                    </div>
                                </div> */}
                                <text className="formtext">비밀번호</text>
                                <input type="password" className="addtext" name="mobile" placeholder="숫자 네 자리" value={values.mobile} onChange={handleInputChange}/>
                            </div>
                            {/* <div className="form-group input-group col-md-6">
                                {/* <div className="input-group-prepend">
                                    <div className="input-group-text">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                </div> 
                                <input className="form-control" placeholder="Email" name="email" value={values.email} onChange={handleInputChange}/>
                            </div> */}
                        </div>
                        <div className="form-group">
                          <textarea className="text" name="address" value={values.address} onChange={handleInputChange} />
                        </div>
                        <div>
                            <input type="submit" className="sendbtn" value={currentId==''?"Save":"Update"} />
                        </div>
                    </form>
                  </div>
                </ModalContent>
                <CloseModalButton
                  aria-label='Close modal'
                  onClick={() => setShowModal(prev => !prev)}
                />
              </ModalWrapper>
            </animated.div>
          </Background>
        </Draggable>

      ) : null}
    </>
  );
};
