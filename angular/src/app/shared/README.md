Shared Module
=============

`~/src/app/shared`

The shared module contains classes and resources which are used in more than one dynamically loaded module. By always
loading with the application the shared components are ready whenever a module requests them.

The shared module is a good place to import and export the ``FormsModule``
and the ``ReactiveFormsModule``. It is also good for the ``FontAwesomeModule``
and any other resource used by some modules some of the time but not all modules all of the time.

This module is recommended for a `path alias` to **@shared**
