import React, { useEffect } from 'react';
import './TestimonialsSection.css';

export default function TestimonialsSection() {
  useEffect(() => {
    const leftArrow = document.querySelector('.arrow.left');
    const rightArrow = document.querySelector('.arrow.right');
    const container = document.querySelector('.testimonial-container');

    const scrollLeft = () => {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    };

    const scrollRight = () => {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    };

    leftArrow.addEventListener('click', scrollLeft);
    rightArrow.addEventListener('click', scrollRight);

    return () => {
      leftArrow.removeEventListener('click', scrollLeft);
      rightArrow.removeEventListener('click', scrollRight);
    };
  }, []);

  return (
    <section className="testimonial-section">
      <h2>What Our Users Say</h2>
      <div className="arrow left">&#8249;</div>
      <div className="testimonial-container">
        <div className="testimonial">
          <img src="https://via.placeholder.com/50" alt="User 1" />
          <p>"This platform has completely transformed the way I work. Highly recommended!"</p>
          <h4>John Doe</h4>
          <span className="rating">★★★★★</span>
        </div>
        <div className="testimonial">
          <img src="https://via.placeholder.com/50" alt="User 2" />
          <p>"Amazing experience! The support team is very responsive and helpful."</p>
          <h4>Priya Sharma</h4>
          <span className="rating">★★★★★</span>
        </div>
        <div className="testimonial">
          <img src="https://via.placeholder.com/50" alt="User 3" />
          <p>"I love the user-friendly interface and the features it offers. Great job!"</p>
          <h4>Chen Wei</h4>
          <span className="rating">★★★★★</span>
        </div>
        <div className="testimonial">
          <img src="https://via.placeholder.com/50" alt="User 4" />
          <p>"A fantastic tool that has made my daily tasks so much easier. Thank you!"</p>
          <h4>Adebayo Okafor</h4>
          <span className="rating">★★★★★</span>
        </div>
      </div>
      <div className="arrow right">&#8250;</div>
    </section>
  );
}