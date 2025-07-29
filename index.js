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
                    <p><b>i'll be starting my Computer Science degree at Purdue University this fall.</b> i'd love to study some
                        secondary education, perhaps a double major in Math or Physics.
                        i come from an engineering background: i've worked as President and Lead Payload Engineer for my Aerial
                        Robotics team. CS: i've worked with robotics, human-computer interaction, vr/ar and machine
                        learning.
                        my work aims to make digital solutions to real technical problems.
                    </p>
                    <p>
                        <b>i love to learn and get immersed in whatever creative realm i find.</b> in my spare time, you can
                        find
                        me
                        watching movies (attempting to be a film connoisseur), drawing characters in my sketchbook, and being
                        with my family. i also have an origami collection of miscellaneous sorts: Star Wars, animals, random
                        cool shapes.
                    </p>
                    <p>
                        currently, i'm working on an ASL translator with Google's Mediapipe library for real-time hand gesture
                        detection and tracking, experimenting with OpenCV and other Python libraries.
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