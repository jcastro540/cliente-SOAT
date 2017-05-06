import { ClienteSOATPage } from './app.po';

describe('cliente-soat App', () => {
  let page: ClienteSOATPage;

  beforeEach(() => {
    page = new ClienteSOATPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
