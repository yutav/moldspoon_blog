type Prop = {
  title: string
}
const CodeBlockTitle: React.FC<Prop> = ({ title }) => {
  return <><div className="code-title">{title}</div>
    <style jsx>{`
        .code-title {

          border-top-left-radius: 5px !important;
          border-top-right-radius: 5px !important;        
          border-radius-top-left: 5px;
          padding: 0px 10px;
          margin-top: 30px;
          width: auto;
          background: darkgray;
          color: black;
        }
      `}</style>
  </>
}

export default CodeBlockTitle