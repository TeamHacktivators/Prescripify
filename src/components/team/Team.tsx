import Navbar from "../navbar/Navbar";
import styles from "./team.module.css";
import Vridhi from "../../assets/vridhi.jpeg"
import Sumit from "../../assets/dualfaced.jpg"
import Vedant from "../../assets/vediie.png"
import Harshit from "../../assets/harshit.jpg"

const Team = () => {
  const teamMembers = [
    {
        name: "Harshit Aggarwal",
        img: Harshit,
        linkedin: "https://www.linkedin.com/in/harshit-aggarwal-962458226/",
        github: "https://github.com/Blasterharsh99",
    },
    
    {
        name: "Sumit Grover",
        img: Sumit,
        linkedin: "https://www.linkedin.com/in/sumit-grover-29a277256/",
        github: "https://github.com/Sumaniac28",
    },
    {
        name: "Vedant Sudhir Patil",
        img: Vedant,
        linkedin: "https://www.linkedin.com/in/vedantspatil/",
        github: "https://github.com/Vedant-SPatil",
    },
    {
        name: "Vridhi Duggal",
        img: Vridhi,
        linkedin: "https://www.linkedin.com/in/vridhi-duggal-060682275/",
        github: "https://github.com/VridhiDuggal",
    },
  ];

  return (
    <section>
        <Navbar />
        <div className={styles.teamSection}>
        <h1 className={styles.title}>Meet Our Team</h1>
        <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
            <div className={styles.teamMember} key={index}>
                <img
                src={member.img}
                alt={member.name}
                className={styles.memberImage}
                />
                <h2 className={styles.memberName}>{member.name}</h2>
                <div className={styles.socialIcons}>
                <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                >
                    <i className="bi bi-linkedin"></i>
                </a>
                <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.socialLink}
                >
                    <i className="bi bi-github"></i>
                </a>
                </div>
            </div>
            ))}
        </div>
        </div>
    </section>
  );
};

export default Team;
