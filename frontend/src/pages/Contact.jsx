import React, { useRef } from 'react';
import img1 from "../assets/contact.webp";
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

export default function Contact() {
  
  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    // Show loading SweetAlert
    Swal.fire({
      icon: "info",
      iconColor: '#007762',
      title: 'Sending...',
      text: 'Please wait while we send your message.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    emailjs.sendForm(
      'service_jsu5ykn',
      'template_v7zytlf',
      form.current,
      'FkiVa2oR23KoLd3ff'
    )
      .then((result) => {
        Swal.fire({
          icon: "success",
          iconColor: '#007762',
          icon: 'success',
          title: 'Message Sent!',
          text: 'Thank you for contacting us. We will get back to you soon.',
          confirmButtonColor: '#007762'
        });
        console.log(result.text);
      }, (error) => {
        Swal.fire({
          icon: 'error',
          iconColor: '#007762',
          title: 'Oops...',
          text: 'Something went wrong! Please try again later.',
          confirmButtonColor: '#d33'
        });
        console.error(error.text);
      });

    e.target.reset(); // Clear the form
  };


  return (
    <section className='w-full flex mt-[35px] overflow-hidden relative top-[30px] h-[550px] md:h-[550px] lg:h-[650px] xl:h-[750px]'>
      <div className='w-[42%] hidden md:block'>
        <img src={img1} className='w-full h-full object-cover' alt="Contact" />
      </div>
      <div className='w-full md:w-[58%] px-[40px] lg:px-[80px] xl:pt-[80px]'>
        <div className='hidden lg:block'>
          <h1 className='text-[40px] font-semibold p color'>Information About us</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </div>
        <div>
          <h1 className='text-[40px] font-semibold p color mt-[40px]'>Get In Touch</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </div>

        <form ref={form} onSubmit={sendEmail} className='mt-[30px] xl:mt-[50px]'>
          <input type="text" name="user_name" placeholder='Your Name' className='input px-4 py-2 lg:py-4' required />
          <div className='flex flex-col md:flex-row'>
            <input type="email" name="user_email" placeholder='Enter Your Email' className='input w-full md:w-[49%] mr-1 px-4 py-2 lg:py-4' required />
            <input type="text" name="subject" placeholder='Subject' className='input w-full md:w-[50%] px-4 py-2 lg:py-4' />
          </div>
          <textarea name="message" placeholder='Your Message' className='input px-4 py-2 lg:py-4' required />
          <button type="submit" className="btn mt-[20px] lg:mt-[40px] mb-[30px]">Send</button>
        </form>
      </div>
    </section>
  );
}
