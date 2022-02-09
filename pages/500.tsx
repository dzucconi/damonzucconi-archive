import { DefinitionList } from "../components/core/DefinitionList";
import { NavigationLayout } from "../components/layouts/NavigationLayout";
import { Meta } from "../components/core/Meta";

const Error500Page = () => {
  return (
    <>
      <Meta title="Internal Server Error" />

      <DefinitionList
        definitions={[
          { term: "Status", definition: "500" },
          { term: "Error", definition: "Internal Server Error" },
          {
            term: "Description",
            definition:
              "A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.",
          },
        ]}
      />
    </>
  );
};

Error500Page.getLayout = NavigationLayout;

export default Error500Page;
