import { Nav, Tab } from "react-bootstrap";

import { useSearchPage } from "@/components/authority-search-page/authority-search-page-context";
import { tabList } from "@/components/authority-search-page/authority-search-page-tabs";

export default function AuthoritySearchResult() {
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
      <Nav variant="tabs" role="tablist">
        {tabList.map((tab) => (
          <Nav.Item key={tab.id}>
            <Nav.Link eventKey={tab.id}>{tab.label}</Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      <Tab.Content className="border-start border-end border-bottom p-3 bg-white">
        {tabList.map((tab) => (
          <Tab.Pane
            key={tab.id}
            eventKey={tab.id}
            tabIndex={0}
            className="table-responsive"
          >
            {tab.content}
          </Tab.Pane>
        ))}
      </Tab.Content>
    </Tab.Container>
  );
}
