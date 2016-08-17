import { ConnectFourWebpackPage } from './app.po';

describe('connect-four-webpack App', function() {
  let page: ConnectFourWebpackPage;

  beforeEach(() => {
    page = new ConnectFourWebpackPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
