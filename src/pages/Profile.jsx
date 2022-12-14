import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import { getAuth, updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  //! State
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth?.currentUser?.displayName,
    email: auth?.currentUser?.email
  });
  const { name, email } = formData;
  const [changeDetails, setChangeDetails] = useState(false);
  const navigate = useNavigate();

  //! Function
  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update display name in fb
        await updateProfile(auth.currentUser, {
          displayName: name,
        })

        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error("Could not update profile details")
    }
  }

  const onChange = (e) => {
    console.log(e.target.id);
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  //! Render
  return (
    <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">
          My Profile
        </p>
        <button className='logOut' type='button' onClick={onLogout}>Logout</button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className='profileDetailsText'>Personal Details</p>
          <p
            className='changePersonalDetails'
            onClick={() => {
              changeDetails && onSubmit()
              setChangeDetails((prevState) => !prevState)
            }}
          >
            {changeDetails ? 'done' : 'change'}
          </p>
        </div>

        <div className="profileCard">
          <Formik>
            {propsFormik => (
              <Form>
                <input type="text" id='name' className={!changeDetails ? 'profileName' : 'profileNameActive'} disabled={!changeDetails} value={name} onChange={onChange} />
                <input type="text" id='email' className={!changeDetails ? 'profileEmail' : 'profileEmailActive'} disabled={!changeDetails} value={email} onChange={onChange} />
              </Form>
            )}
          </Formik>
        </div>
      </main>
    </div>
  )
}

export default Profile