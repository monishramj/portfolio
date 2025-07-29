function changePage(page) {
    var content = document.getElementById('content');

    content.classList.remove('fade-in');

    content.innerHTML = '';

    let wrapper = document.createElement('div');
    wrapper.classList.add('fade-in');


    switch (page) {
        case 'home':
            wrapper.innerHTML = `
                <div class="intro">
                    <p>
                        <b>hello! i'm monish, welcome to my homepage.</b>
                        i build things at the intersection of engineering and human-computer interaction.

                    </p>
                </div>

                <hr>

                <div class="box-element">
                    <img class="box-img"
                        src="https://www.researchgate.net/profile/Praveena-Akki/publication/382146609/figure/fig2/AS:11431281259844311@1720673477163/Tracking-and-analyzing-hand-using-mediapipe_Q320.jpg"
                        alt="Placeholder Img" />
                    <div class="box-txt">
                        <h2>☂ currently building</h2>
                        <h3>ASL Interpreter</h3>
                        <p>
                            <b>ML project to detect ASL (American Sign Language) alphabet and symbols and translate to text,
                                using MediaPipe + Python + TensorFlow.</b>
                            Currently in the learning phase and planning the basic idea for the project.
                        </p>
                    </div>
                </div>

                <div class="box-element">
                    <img class="box-img"
                        src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Books and learning" />

                    <div class="box-txt">

                        <h2>⛳︎ currently learning</h2>
                        <h3>Deep Dive Topics</h3>
                        <p>
                            <b>Computer Vision & ML:</b> exploring advanced techniques in image processing and neural networks.
                            <br>
                            <b>System Design:</b> understanding scalable architecture patterns.
                            <br>
                            <b>Algorithms & Data Structures:</b> strengthening problem-solving fundamentals through practice.
                        </p>
                    </div>

                </div>
        `;
            break;
        case 'about':
            wrapper.innerHTML = `
                <section class="intro">
                    <br>
                    <h3>my story.</h3>
                    <p><b>hi! i'm monish.</b></p>
                    <p><b>i'll be pursuing Computer Science at Purdue University this fall.</b> 
                        my foundation lies in engineering: i've lead as President and Lead Payload Engineer for my Aerial
                        Robotics team. beyond robotics being my main passion, i've worked with human-computer interaction, virtual reality systems and machine
                        learning through <b> mobile development, simulation platforms, and embedded systems programming.</b> 
                        i aim to make digital yet human-centric solutions to real technical problems. i'm especially drawn to interdisciplinary challenges, 
                        threading design, software, and hardware.
                    </p>
                    <p>
                        <b>i love to learn and get immersed in whatever creative realm i find.</b> in my spare time, you can
                        find me watching movies - attempting to be a film connoisseur, drawing characters in my sketchbook, and being
                        with my family. i also have an origami collection of miscellaneous sorts: Star Wars, animals, random
                        cool shapes.
                    </p>
                    <p>
                        i'm always open to meeting new people and communicating. feel free to reach out!
                    </p>
                </section>

                <section class="intro">
                    <br>
                    <h3>my toolbox.</h3>
                    <p>
                        <b>here's what i've worked with.</b>
                        my strongest suites are Java and Python. all technologies listed are not in any specific order.
                    </p>
                </section>
                `;
            break;

        default:
            wrapper.innerHTML = '<h2 class="intro">page not found.</h2>';
    }

    content.appendChild(wrapper);

}