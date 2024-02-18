import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import './App.css';
import CardMenu from './components/CardMenu';
import Addmember from './components/Addmember';
import AddOpportunity from './components/AddOpportunity';
import { debounce } from 'lodash';


function App() {

  const [qualified, setQualified] = useState([]);
  const [leads, setLeads] = useState([]);
  const [booked, setBooked] = useState([]);
  const [treated, setTreated] = useState([]);
  const [query, setQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [memberAdded, setmemberAdded] = useState(false);

  useEffect(() => {
    callOpportunityApi();
  }, []);


  const callOpportunityApi = () => {
    axios.get('http://localhost:3001/opportunities.json')
      .then(response => {
        const { leads, qualified, booked, treated } = response.data;

        setLeads(leads);
        setQualified(qualified);
        setBooked(booked);
        setTreated(treated);

      })
      .catch(error => {
        console.error('Error fetching opportunities:', error);
      });    
  }  

  const debouncedSearch = useMemo(() => debounce(async (searchQuery) => {
    try {
      const response = await axios.get(`http://localhost:3001/opportunities.json?query=${searchQuery}`);
      const { leads, qualified, booked, treated } = response.data;

      setLeads(leads);
      setQualified(qualified);
      setBooked(booked);
      setTreated(treated);
    } catch (error) {
      console.error('Error searching:', error);
    }
  }, 1500), []);


  const handleSearch = (event) => {
    const { value } = event.target;
    setQuery(value);
    debouncedSearch(value);
  };


  const handleSaveData = async (formData) => {
    try {
      const endpoint = 'http://localhost:3001/members.json';
      const response = await axios.post(endpoint, { member: formData }, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setmemberAdded(true)

    } catch (error) {
      console.error('Error creating member:', error);
    }
  };


  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div>
        <header className="header">
          <label className="heading">
            <b>Pulse</b>
          </label>
        </header>
      </div>

      <div className="body">
        <div className="flex-sb-main">
          <label>
            <b>Patients</b>
          </label>
          <div style={{ display: "flex" }}>
            <span>
              <button className="addmember" onClick={handleOpenModal}>
                Add Member
              </button>
              <Addmember
                showModal={showModal}
                handleClose={handleCloseModal}
                handleSave={handleSaveData}
              />
            </span>
            <input
              className="searchbox"
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search" />
          </div>

        </div>
        <div className="flex-sb-main">

        </div>

        <div className="flex-sb-main mt-20">
          <div className="fb-20">
            <div className="fb-20">
              <label>Leads ({leads.length})</label>
              <AddOpportunity
                callOpportunityApi={callOpportunityApi}
                memberAdded={memberAdded}
              />
            </div>

            <div className="mt-20 mb-20">
              {leads.map((record) => (
                <CardMenu
                  callOpportunityApi={callOpportunityApi}
                  record={record}
                />
              ))}
            </div>
          </div>

          <div className="fb-20">
            <div className="fb-20">
              <label>Qualified ({qualified.length})</label>

            </div>
            <div className="mt-20">
              {qualified.map((record) => (
                <CardMenu
                callOpportunityApi={callOpportunityApi}

                  record={record}
                />
              ))}
            </div>
          </div>
          <div className="fb-20">
            <div className="fb-20">
              <label>Booked ({booked.length})</label>

            </div>
            <div className="mt-20">
              {booked.map((record) => (
                <CardMenu
                callOpportunityApi={callOpportunityApi}

                  record={record}
                />
              ))}
            </div>
          </div>
          <div className="fb-20">
            <div className="fb-20">
              <label>Treated ({treated.length})</label>

            </div>
            <div className="mt-20">
              {treated.map((record) => (
                <CardMenu
                callOpportunityApi={callOpportunityApi}

                  record={record}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
