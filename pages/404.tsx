import { DefinitionList } from "../components/core/DefinitionList";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Meta } from "../components/core/Meta";

const Error404Page = () => {
  return (
    <>
      <Meta title="Not Found" />

      <DefinitionList
        definitions={[
          { term: "Status", definition: "404" },
          { term: "Error", definition: "Not Found" },
          {
            term: "Description",
            definition:
              "The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.",
          },
        ]}
      />
    </>
  );
};

Error404Page.getLayout = NavigationLayout;

export default Error404Page;
