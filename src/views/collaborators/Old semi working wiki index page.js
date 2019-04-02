<!DOCTYPE html>
<html>
  <head>
    <% include ../static/partials/head.ejs %>
  </head>
  <body>
    <main class="container">
      <% include ../static/partials/navbar.ejs %>

      <h1>Wikis</h1>

      <% if(currentUser && currentUser.role == 0) { %>

        <ul class="list-group">
          <% wikis.forEach((wiki) => { %>
         <% if(wiki.private == false) { %>
            <li class="list-group-item">
              <a href="/wikis/<%= wiki.id %>"> <%= wiki.title %> </a>
            </li>
         <% } %>   
          <% }) %>
        </ul>

        <br>

        <a href="/wikis/new" class="btn btn-success">Create New Wiki</a>

      <% } else if (currentUser && currentUser.role !== 0) { %>

      <br>

        <ul class="list-group">
          <% wikis.forEach((wiki) => { %>
            <li class="list-group-item">
              <a href="/wikis/<%= wiki.id %>"> <%= wiki.title %> </a>
            </li>
          <% }) %>
        </ul>

        <br>

        <a href="/wikis/new" class="btn btn-success">Create New Premium Wiki</a>

      <% } %>

    </main>
  </body>
</html>
