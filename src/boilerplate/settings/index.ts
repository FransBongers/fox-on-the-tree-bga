class Settings {
  private static instance: Settings;
  protected game: GameAlias;

  private modal: Modal;
  public settings: Record<string, string | number> = {};

  private selectedTab: SettingsTabId = 'layout';
  private tabs: { id: SettingsTabId; name: string }[] = [
    {
      id: 'layout',
      name: _('Layout'),
    },
    {
      id: 'gameplay',
      name: _('Gameplay'),
    },
  ];

  constructor(game: GameAlias) {
    this.game = game;
    const gamedatas = game.gamedatas;

    this.setup({ gamedatas });
  }

  public static create(game: GameAlias) {
    Settings.instance = new Settings(game);
  }

  public static getInstance() {
    return Settings.instance;
  }

  // .##.....##.##....##.########...#######.
  // .##.....##.###...##.##.....##.##.....##
  // .##.....##.####..##.##.....##.##.....##
  // .##.....##.##.##.##.##.....##.##.....##
  // .##.....##.##..####.##.....##.##.....##
  // .##.....##.##...###.##.....##.##.....##
  // ..#######..##....##.########...#######.

  clearInterface() {}

  updateInterface({ gamedatas }: { gamedatas: GamedatasAlias }) {}

  // ..######..########.########.##.....##.########.
  // .##....##.##..........##....##.....##.##.....##
  // .##.......##..........##....##.....##.##.....##
  // ..######..######......##....##.....##.########.
  // .......##.##..........##....##.....##.##.......
  // .##....##.##..........##....##.....##.##.......
  // ..######..########....##.....#######..##.......

  private addButton({ gamedatas }: { gamedatas: GamedatasAlias }) {
    const configPanel = document.getElementById('info-panel-buttons');
    if (configPanel) {
      configPanel.insertAdjacentHTML('beforeend', tplSettingsButton());
    }
  }

  private setupModal({ gamedatas }: { gamedatas: GamedatasAlias }) {
    this.modal = new Modal(`settings_modal`, {
      class: 'settings_modal',
      closeIcon: 'fa-times',
      titleTpl:
        '<h2 id="popin_${id}_title" class="${class}_title">${title}</h2>',
      title: _('Settings'),
      contents: tplSettingsModalContent({
        tabs: this.tabs,
      }),
      closeAction: 'hide',
      verticalAlign: 'flex-start',
      breakpoint: 740,
    });
  }

  // Setup functions
  setup({ gamedatas }: { gamedatas: GamedatasAlias }) {
    this.addButton({ gamedatas });
    this.setupModal({ gamedatas });
    this.setupModalContent();
    this.changeTab({ id: this.selectedTab });

    dojo.connect($(`show_settings`), 'onclick', () => this.open());
    this.tabs.forEach(({ id }) => {
      dojo.connect($(`settings_modal_tab_${id}`), 'onclick', () =>
        this.changeTab({ id })
      );
    });
  }

  // .##.....##.########..########.....###....########.########
  // .##.....##.##.....##.##.....##...##.##......##....##......
  // .##.....##.##.....##.##.....##..##...##.....##....##......
  // .##.....##.########..##.....##.##.....##....##....######..
  // .##.....##.##........##.....##.#########....##....##......
  // .##.....##.##........##.....##.##.....##....##....##......
  // ..#######..##........########..##.....##....##....########

  // ..######...#######..##....##.########.########.##....##.########
  // .##....##.##.....##.###...##....##....##.......###...##....##...
  // .##.......##.....##.####..##....##....##.......####..##....##...
  // .##.......##.....##.##.##.##....##....######...##.##.##....##...
  // .##.......##.....##.##..####....##....##.......##..####....##...
  // .##....##.##.....##.##...###....##....##.......##...###....##...
  // ..######...#######..##....##....##....########.##....##....##...

  private setupModalContent() {
    const config = getSettingsConfig();
    const node = document.getElementById('setting_modal_content');
    if (!node) {
      return;
    }

    Object.entries(config).forEach(([tabId, tabConfig]) => {
      node.insertAdjacentHTML(
        'beforeend',
        tplSettingsModalTabContent({ id: tabId })
      );

      const tabContentNode = document.getElementById(
        `settings_modal_tab_content_${tabId}`
      );
      if (!tabContentNode) {
        return;
      }

      Object.values(tabConfig.config).forEach((setting) => {
        const { id, type, defaultValue, visibleCondition } = setting;

        // Set current value (local storage value or default)
        const localValue = localStorage.getItem(
          this.getLocalStorageKey({ id })
        );
        this.settings[id] = localValue || defaultValue;

        // Call change method to update interface based on current value
        const methodName = this.getMethodName({ id });
        if (setting.onChangeInSetup && localValue && this[methodName]) {
          this[methodName](localValue);
        }

        // Add content to modal
        if (setting.type === 'select') {
          const visible =
            !visibleCondition ||
            (visibleCondition &&
              visibleCondition.values.includes(
                this.settings[visibleCondition.id]
              ));

          tabContentNode.insertAdjacentHTML(
            'beforeend',
            tplPlayerPrefenceSelectRow({
              setting,
              currentValue: this.settings[setting.id] as string,
              visible,
            })
          );
          const controlId = `setting_${setting.id}`;
          $(controlId).addEventListener('change', () => {
            const value = $(controlId).value;
            this.changeSetting({ id: setting.id, value });
          });
        } else if (setting.type === 'slider') {
          const visible =
            !visibleCondition ||
            (visibleCondition &&
              visibleCondition.values.includes(
                this.settings[visibleCondition.id]
              ));

          tabContentNode.insertAdjacentHTML(
            'beforeend',
            tplPlayerPrefenceSliderRow({
              id: setting.id,
              label: setting.label,
              visible,
            })
          );
          const sliderConfig = {
            ...setting.sliderConfig,
            start: this.settings[setting.id],
          };

          noUiSlider.create($('setting_' + setting.id), sliderConfig);
          $('setting_' + setting.id).noUiSlider.on('slide', (arg) =>
            this.changeSetting({ id: setting.id, value: arg[0] as string })
          );
        }
      });
    });
  }

  // ..#######..##....##.....######..##.....##....###....##....##..######...########
  // .##.....##.###...##....##....##.##.....##...##.##...###...##.##....##..##......
  // .##.....##.####..##....##.......##.....##..##...##..####..##.##........##......
  // .##.....##.##.##.##....##.......#########.##.....##.##.##.##.##...####.######..
  // .##.....##.##..####....##.......##.....##.#########.##..####.##....##..##......
  // .##.....##.##...###....##....##.##.....##.##.....##.##...###.##....##..##......
  // ..#######..##....##.....######..##.....##.##.....##.##....##..######...########

  private changeSetting({ id, value }: { id: string; value: string }) {
    const suffix = this.getSuffix({ id });
    this.settings[id] = value;
    localStorage.setItem(this.getLocalStorageKey({ id }), value);
    const methodName = this.getMethodName({ id });

    if (this[methodName]) {
      this[methodName](value);
    }
  }

  public onChangeTwoColumnLayoutSetting(value: string) {
    // console.log('onChangeTwoColumnsLayoutSetting', value);
    this.checkColumnSizesVisisble();
    const node = document.getElementById('play-area-container');
    if (node) {
      node.setAttribute('data-two-columns', value);
    }
    this.game.updateLayout();
  }

  public onChangeColumnSizesSetting(value: string) {
    this.game.updateLayout();
  }

  public onChangeTileSizeSetting(value: string) {
    this.game.updateLayout();
  }

  public onChangeCardSizeSetting(value: number) {
    // TODO: make this working with single and two column
    // const node = document.getElementById("gest_card_area");
    // if (node) {
    //   node.style.setProperty(
    //     "--gestCardSizeScale",
    //     `${Number(value) / 100}`
    //   );
    // }
  }

  public onChangeCardSizeInLogSetting(value: number) {
    // console.log("onChangeCardSizeInLogSetting", value);
    const ROOT = document.documentElement;
    ROOT.style.setProperty('--logCardScale', `${Number(value) / 100}`);
  }

  public onChangeAnimationSpeedSetting(value: number) {
    const duration = 2100 - value;
    debug('onChangeAnimationSpeedSetting', duration);
    this.game.animationManager.getSettings().duration = duration;
  }

  public onChangeShowAnimationsSetting(value: string) {
    if (value === PREF_ENABLED) {
      this.game.animationManager.getSettings().duration = Number(
        this.settings[PREF_ANIMATION_SPEED]
      );
    } else {
      this.game.animationManager.getSettings().duration = 0;
    }
    this.checkAnmimationSpeedVisisble();
  }

  public onChangeCardInfoInTooltipSetting(value: string) {
    // this.game.cardArea.updateTooltips();
    this.game.updateLogTooltips();
  }

  //  .##.....##.########.####.##.......####.########.##....##
  //  .##.....##....##.....##..##........##.....##.....##..##.
  //  .##.....##....##.....##..##........##.....##......####..
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  .##.....##....##.....##..##........##.....##.......##...
  //  ..#######.....##....####.########.####....##.......##...

  private changeTab({ id }: { id: SettingsTabId }) {
    const currentTab = document.getElementById(
      `settings_modal_tab_${this.selectedTab}`
    );
    const currentTabContent = document.getElementById(
      `settings_modal_tab_content_${this.selectedTab}`
    );
    currentTab.removeAttribute('data-state');
    if (currentTabContent) {
      currentTabContent.style.display = 'none';
    }

    this.selectedTab = id;
    const tab = document.getElementById(`settings_modal_tab_${id}`);
    const tabContent = document.getElementById(
      `settings_modal_tab_content_${this.selectedTab}`
    );
    tab.setAttribute('data-state', 'selected');
    if (tabContent) {
      tabContent.style.display = '';
    }
  }

  private checkAnmimationSpeedVisisble() {
    const sliderNode = document.getElementById('setting_row_animationSpeed');
    if (!sliderNode) {
      return;
    }
    if (this.settings[PREF_SHOW_ANIMATIONS] === PREF_ENABLED) {
      sliderNode.style.display = '';
    } else {
      sliderNode.style.display = 'none';
    }
  }

  private checkColumnSizesVisisble() {
    const sliderNode = document.getElementById('setting_row_columnSizes');
    const mapSizeSliderNode = document.getElementById(
      'setting_row_singleColumnMapSize'
    );

    if (!(sliderNode && mapSizeSliderNode)) {
      return;
    }

    if (this.settings['twoColumnsLayout'] === PREF_ENABLED) {
      sliderNode.style.display = '';
      mapSizeSliderNode.style.display = 'none';
    } else {
      sliderNode.style.display = 'none';
      mapSizeSliderNode.style.display = '';
    }
  }

  private getMethodName({ id }: { id: string }) {
    return `onChange${this.getSuffix({ id })}Setting`;
  }

  public get(id: string): string | number | null {
    return this.settings[id] || null;
  }

  private getSuffix({ id }: { id: string }) {
    return id.charAt(0).toUpperCase() + id.slice(1);
  }

  private getLocalStorageKey({ id }: { id: string }) {
    const key = `${this.game.framework().game_name}-${this.getSuffix({ id })}`;
    return key;
  }

  public open() {
    this.modal.show();
  }
}
