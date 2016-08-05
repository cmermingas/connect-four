import { ConnectFourPage } from './app.po';

describe('connect-four App', function() {
  let page: ConnectFourPage;

  beforeEach(() => {
    page = new ConnectFourPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
