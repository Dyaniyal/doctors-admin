import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './card.css' 
import AddOpportunity from './AddOpportunity';


const CardMenu = ({ record, callOpportunityApi }) => {
  const [showModal, setShowModal] = useState(false);
  const [changeStage, setChangeStage] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const Stage = {
    LEAD: 'lead',
    QUALIFIED: 'qualified',
    BOOKED: 'booked',
    TREATED: 'treated'
  };

  const getNextStage = (current_stage) => {
    switch (current_stage) {
      case Stage.LEAD:
        return Stage.QUALIFIED;
      case Stage.QUALIFIED:
        return Stage.BOOKED;
      case Stage.BOOKED:
        return Stage.TREATED;
    }
  };

  const moveStage = () => {
    record.stage = getNextStage(record.stage)
    record.changed = true
    setChangeStage(true)
  };

  useEffect(() => {
    if (changeStage) {
      console.log(changeStage)
      setChangeStage(false)
    }
  }, [changeStage])


  return (
    <div>
      <div className="mb-20">
        <div className="flex-start card-header">
          <div className="mr-10 ml-10">
            <img src={'http://localhost:3001/'+ record.patient.avatar} width="30" height="30" alt="Logo Icon" />
          </div>
          <div>
            <p>{`${record.patient.first_name} ${record.patient.last_name}`}</p>
            <p>{record.patient.age} years old</p>
          </div>
        </div>

        <div className="flex-sb-card card-body">
          <div>
            <div className="ml-10">
              <p>{record.procedure_name}</p>
              <p>{record.doctor.first_name}</p>
              <div className="flex-sb-card">
                <div>
                  {Object.entries(record.stage_history).map(([stage, value]) => {
                    return value && <p key={stage}>{stage}</p>
                  })}
                </div>
                <div className="ml-10">
                  {Object.entries(record.stage_history).map(([stage, value]) => {
                    return value && <p key={stage}>{new Date(value).toLocaleString()}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mr-10">
            <img src={'http://localhost:3001/'+record.doctor.avatar} width="30" height="30" alt="Logo Icon" />
            <div onClick={handleOpenModal} >
              <img src="pen.png" width="30" height="15" alt="Logo Icon" />
            </div>
            {record.stage !== 'treated' &&
              <div onClick={() => moveStage(true) } >
                <img src="right-arrow.png" width="20" height="15" alt="Logo Icon" />
              </div>
            }
          </div>
          <AddOpportunity
            isOpen={showModal}
            onClose={handleCloseModal}
            record={record}
            callOpportunityApi={callOpportunityApi}
          />
        </div>
      </div>
    </div>
  );
};

export default CardMenu;
