import { IndexPresenter } from '../../ui/pages/indexpresenter';
import { IIndexView } from '../../ui/pages/IIndexView';
import { IndexView } from '../../ui/pages/IndexView';
import { IConfig } from '../../core/domain/IConfig';
import { Config } from '../../core/domain/Config';
import { ITaskParser } from '../../core/services/ITaskParser';
import { TaskParser } from '../../core/services/TaskParser';
import { IFileSystem } from '../../core/utility/IFileSystem';
import { FileSystem } from '../../core/utility/FileSystem';
import { ITaskService } from '../../core/services/ITaskService';
import { TaskService } from '../../core/services/TaskService';
import { ITaskSorter } from '../../core/services/ITaskSorter';
import { TaskSorter } from '../../core/services/TaskSorter';
import { ITaskFilterService } from '../../core/services/ITaskFilterService';
import { TaskFilterService } from '../../core/services/TaskFilterService';
import { IConfigLoader } from './IConfigLoader';
import { ConfigLoader } from './ConfigLoader';
import { AppFilenames } from './AppFilenames';
import { IAppFilenames } from './IAppFilenames';

export class IoC {
    //IIndexView
    static get IIndexView(): IIndexView {
        return new IndexView();
    }

    //IConfig
    static get IConfig(): IConfig {
        return this.IConfigLoader.LoadConfig();
    }

    //ITaskParser
    static get ITaskParser(): ITaskParser {
        return new TaskParser();
    }

    //IFileSystem
    static get IFileSystem(): IFileSystem {
        return new FileSystem();
    }

    //ITaskService
    static get ITaskService(): ITaskService {
        return new TaskService(this.IConfig, this.ITaskParser, this.IFileSystem);
    }

    //ITaskSorter
    static get ITaskSorter(): ITaskSorter {
        return new TaskSorter();
    }

    //ITaskFilterService
    static get ITaskFilterService(): ITaskFilterService {
        return new TaskFilterService(this.IConfig);
    }

    //IndexPresenter
    static get IndexPresenter(): IndexPresenter {
        return new IndexPresenter(this.IIndexView, this.ITaskService, this.ITaskSorter, this.ITaskFilterService);
    }

    //IConfigLoader
    static get IConfigLoader(): IConfigLoader {
        return new ConfigLoader(this.IAppFilenames, this.IFileSystem);
    }

    //IAppFilenames
    static get IAppFilenames(): IAppFilenames {
        return new AppFilenames();
    }
}
