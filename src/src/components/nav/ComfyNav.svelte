<script>
import MobileMenu from './MobileMenu.svelte'
import DesktopMenu from './DesktopMenu.svelte'
</script>

<nav>
  <div class="nav__container">
    <DesktopMenu/>
    <MobileMenu client:load/>
  </div>
</nav>

<style>
  nav {
    position: absolute;
    width: 100%;
    background-color: white;
    border-bottom: solid #A6B1E1 4px;
    z-index: 1;
  }

  .nav__container {
    max-width: var(--container-size-lg);
    margin-left: auto;
    margin-right: auto;
  }
</style>
