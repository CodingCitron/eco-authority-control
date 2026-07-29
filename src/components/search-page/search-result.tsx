import { Nav, Tab } from "react-bootstrap";

import { tabList, useSearchPage } from "./search-page-provider";

export default function SearchResult() {
  const { currentTab, setCurrentTab } = useSearchPage();

  return (
    <Tab.Container
      activeKey={currentTab.id}
      onSelect={(eventKey) => {
        const tab = tabList.find(({ id }) => id === eventKey);
        if (tab) setCurrentTab(tab);
      }}
      transition={true}
      mountOnEnter
      unmountOnExit
    >
      <Nav variant="tabs" id="myTab" role="tablist">
        {tabList.map((tab) => (
          <Nav.Item key={tab.id}>
            <Nav.Link eventKey={tab.id}>{tab.label}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content
        className="border-start border-end border-bottom p-3 bg-white"
        id="myTabContent"
      >
        {tabList.map((tab) => (
          <Tab.Pane key={tab.id} eventKey={tab.id} tabIndex={0}>
            <div className="table-responsive">{tab.content}</div>
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
}
