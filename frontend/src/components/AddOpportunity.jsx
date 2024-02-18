import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import { Button, Form } from 'react-bootstrap';

const AddOpportunity = ({ isOpen , onClose, record = {}, callOpportunityApi, memberAdded }) => {
  const new_opportunity = !record.id
  const stage_history = record.stage_history
  const edit_lead = stage_history?.lead;
  const edit_qualified = stage_history?.qualified;
  const edit_booked = stage_history?.booked;
  const edit_treated = stage_history?.treated;
  const edit_doctor = record.doctor?.id;
  const edit_patient = record.patient?.id;
  const [procedureName, setProcedureName] = useState(record.procedure_name || '');
  const [lead, setLead] = useState(edit_lead || '');
  const [qualified, setQualified] = useState(edit_qualified || '');
  const [booked, setBooked] = useState(edit_booked || '');
  const [treated, setTreated] = useState(edit_treated || '');
  const [showModal, setShowModal] = useState(isOpen);
  const [doctors, setDoctors] = useState([]);
  const [doctor, setDoctor] = useState(edit_doctor || '');
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(edit_patient || '');



  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (!new_opportunity)
      onClose();
    setShowModal(false);
  };

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    }
  }, [isOpen])

  console.log(record)
  useEffect(() => {
    if (record.changed) {

      handleSubmit();
    }
  }, [record.changed])

  useEffect(() => {
    axios.get('http://localhost:3001/members.json')
        .then(response => {
          console.log('call members api')
          setDoctors(response.data.doctors)
          setPatients(response.data.patients)
        })
        .catch(error => {
          console.error('Error fetching opportunities:', error);
        });
  }, [memberAdded]);

  const handleSubmit = () => {
    const formData = {
      procedure_name: procedureName,
      doctor_id: doctor,
      patient_id: patient,
      stage: record.stage, 
      stage_history: {
        lead: lead,
        qualified: qualified,
        booked: booked,
        treated: treated
      }
    };

    const url = record.id
      ? `http://localhost:3001/opportunities/${record.id}`
      : 'http://localhost:3001/opportunities';

    const requestMethod = record.id ? 'PUT' : 'POST';

    axios({
      method: requestMethod,
      url: url,
      data: { opportunity: formData }
    })
      .then(response => {
        console.log(response);
          callOpportunityApi();
      })
      .catch(error => {
        console.error('Error fetching opportunities:', error);
      });

    handleCloseModal();
  };

  return (
    <>
    {new_opportunity && 
      <button className="addmember ml-40" onClick={handleOpenModal}>Add opportunity</button>
    }
    <Modal open={showModal} onClose={handleCloseModal} center>
      <h2> { new_opportunity ? 'Add' : 'Edit' } Opportunity</h2>
      <form>
        <div>
          <label>Procedure Name:</label>
          <input
            type="text"
            value={procedureName}
            onChange={(e) => setProcedureName(e.target.value)}
          />
        </div>
        <div>
          <label>Doctor:</label>
          <select
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
          >
          <option value=''>
            {'Select doctor'}
          </option>
          {doctors.map((member) => (
            <option key={member.id} value={member.id}>
              {`${member.first_name} ${member.last_name}`}
            </option>
          ))}
          </select>
        </div>
        <div>
          <label>Patient:</label>
          <select
            value={patient}
            onChange={(e) => setPatient(e.target.value)}
          >
          <option value=''>
            {'Select patient'}
          </option>
          {patients.map((member) => (
            <option key={member.id} value={member.id}>
              {`${member.first_name} ${member.last_name}`}
            </option>
          ))}
          </select>
        </div>
        <div>
          <label>Lead:</label>
          <input
            type="datetime-local"
            value={lead}
            onChange={(e) => setLead(e.target.value)}
          />
        </div>
        <div>
          <label>Qualified:</label>
          <input
            type="datetime-local"
            value={qualified}
            onChange={(e) => setQualified(e.target.value)}
          />
        </div>
        <div>
          <label>Booked:</label>
          <input
            type="datetime-local"
            value={booked}
            onChange={(e) => setBooked(e.target.value)}
          />
        </div>
        <div>
          <label>Treated:</label>
          <input
            type="datetime-local"
            value={treated}
            onChange={(e) => setTreated(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </form>
    </Modal>
    </>
  );
};

export default AddOpportunity;
