import React from 'react';
import Flux from '../flux';
import { Selector } from '../components/utils/Selector';

// import {starthub} from '../../../img/starthub.jpg';

export class Home extends Flux.View {
  constructor() {
    super();

    this.data = [
      { value: -1, name: 'Select a type' },
      { value: 'employer', name: 'Employer' },
      { value: 'employee', name: 'Employee' },
    ];

    this.data2 = [
      { value: 'server', name: 'Server' },
      { value: 'cleaning-person', name: 'Cleaning Person' },
      { value: 'janitor', name: 'janitor' },
    ];

    this.state = {
      hideSecondSelector: true,
    };
  }

  render() {
    return (
      <div>
        <header className="bg-primary text-white">
          <div className="container text-center">
            <h1>Welcome to Scrolling Nav</h1>
            <p className="lead">A landing page template freshly redesigned for Bootstrap 4</p>
          </div>
        </header>

        <section id="about">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <Selector
                  hide={false}
                  stuff={this.data}
                  onChange={newValue => {
                    if (newValue === 'employee') this.setState({ hideSecondSelector: false });
                  }}
                />
                <Selector hide={this.state.hideSecondSelector} stuff={this.data2} />
                <h2>About this page</h2>
                <p className="lead">
                  This is a great place to talk about your webpage. This template is purposefully unstyled so you can
                  use it as a boilerplate or starting point for you own landing page designs! This template features:
                </p>
                <ul>
                  <li>Clickable nav links that smooth scroll to page sections</li>
                  <li>Responsive behavior when clicking nav links perfect for a one page website</li>
                  <li>
                    Bootstrap's scrollspy feature which highlights which section of the page you're on in the navbar
                  </li>
                  <li>Minimal custom CSS so you are free to explore your own unique design options</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="bg-light">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h2>Services we offer</h2>
                <p className="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut optio velit inventore, expedita quo
                  laboriosam possimus ea consequatur vitae, doloribus consequuntur ex. Nemo assumenda laborum vel,
                  labore ut velit dignissimos.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h2>Contact us</h2>
                <p className="lead">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Vero odio fugiat voluptatem dolor, provident
                  officiis, id iusto! Obcaecati incidunt, qui nihil beatae magnam et repudiandae ipsa exercitationem,
                  in, quo totam.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
