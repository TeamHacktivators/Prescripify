import styles from "./TechStack.module.css";
import Navbar from "../navbar/Navbar";

import react from "../../assets/react.png";
import amplify from "../../assets/amplify.png";
import s3 from "../../assets/s3.png";
import transcribe from "../../assets/transcribe.png";
import lambda from "../../assets/lambda.png";
import dynamodb from "../../assets/dynamodb.png";
import machinelearning from "../../assets/machinelearning.png";
import selenium from "../../assets/selenium.png";
import cognito from "../../assets/cognito.png";
import flask from "../../assets/flask.png";

interface TechStackItemType {
  id?: string; 
  name: string; 
  img: string; 
  link?: string; 
}

const techStackItems: TechStackItemType[] = [
  { id: "react", name: "React", img: react, link: "https://react.dev/" },
  { id: "amplify", name: "Amplify", img: amplify, link: "https://aws.amazon.com/amplify/" },
  { id: "s3", name: "AWS S3", img: s3, link: "https://aws.amazon.com/s3/" },
  { id: "transcribe", name: "AWS Transcribe", img: transcribe, link: "https://aws.amazon.com/transcribe/" },
  { id: "lambda", name: "AWS Lambda", img: lambda, link: "https://aws.amazon.com/lambda/" },
  { id: "dynamodb", name: "AWS DynamoDB", img: dynamodb, link: "https://aws.amazon.com/dynamodb/" },
  { id: "ml", name: "Machine Learning", img: machinelearning },
  { id: "selenium", name: "Selenium", img: selenium, link: "https://www.selenium.dev/" },
  { id: "cognito", name: "AWS Cognito", img: cognito, link: "https://aws.amazon.com/cognito/" },
  { id: "flask", name: "Flask", img: flask, link: "https://flask.palletsprojects.com/" },
];

interface TechStackItemProps {
  id?: string;
  name: string;
  img: string;
  link?: string;
}

const TechStackItem: React.FC<TechStackItemProps> = ({ id, name, img, link }) => (
  <div className={styles.item}>
    {link ? (
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img id={id ? styles[id] : undefined} src={img} alt={`${name} logo`} />
      </a>
    ) : (
      <img id={id ? styles[id] : undefined} src={img} alt={`${name} logo`} />
    )}
    <p>{name}</p>
  </div>
);

function TechStack() {
  return (
    <section>
      <Navbar />
      <div id={styles.techContent}>
        <h1 id={styles.techHeading}>Tech Stack</h1>
        <div className={styles.techStack}>
          {techStackItems.map(({ id, name, img, link }) => (
            <TechStackItem
              key={name}
              id={id}
              name={name}
              img={img}
              link={link}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TechStack;
