import { NgPageslidePage } from './app.po';

describe('ng-pageslide App', () => {
  let page: NgPageslidePage;

  beforeEach(() => {
    page = new NgPageslidePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
