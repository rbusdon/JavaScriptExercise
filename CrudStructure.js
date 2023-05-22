const form = document.getElementById("inputForm");
        const gridContainer = document.getElementById("grid");
        let gridCount = 0;

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            updateGrid();
        });

        const updateGrid = () => {
            const user = document.getElementById("input-user").value;
            const name = document.getElementById("input-name").value;
            const surname = document.getElementById("input-surname").value;
            const email = document.getElementById("input-email").value;

            if (!validateUser(user) || !validateEmail(email)) {
                alert("Invalid user or email. Please check your inputs.");
                return;
            }

            const userExists = checkUserExists(user);
            const emailExists = checkEmailExists(email);

            if (userExists) {
                alert("User already exists. Please choose a different user.");
                return;
            }

            if (emailExists) {
                alert("Email already exists. Please choose a different email.");
                return;
            }

            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridItem.dataset.identity = ++gridCount;
            gridItem.innerHTML = `
                <p>Identity: ${gridCount}</p>
                <p>User: ${user}</p>
                <p>Name: ${name}</p>
                <p>Surname: ${surname}</p>
                <p>Email: ${email}</p>
            `;
            gridContainer.appendChild(gridItem);
            clearInputFields();
        }

        const validateUser = (user) => {
            if (!user) return false;
            return true;
        }

        const validateEmail = (email) => {
            if (!email) return false;
            if (!email.includes("@") || !email.includes(".")) return false;
            return true;
        }

        const checkUserExists = (user) => {
            const users = Array.from(gridContainer.querySelectorAll(".grid-item p:nth-of-type(2)")).map(p => p.textContent.split(": ")[1]);
            return users.includes(user);
        }

        const checkEmailExists = (email) => {
            const emails = Array.from(gridContainer.querySelectorAll(".grid-item p:nth-of-type(5)")).map(p => p.textContent.split(": ")[1]);
            return emails.includes(email);
        }

        const clearInputFields = () => {
            document.getElementById("input-user").value = "";
            document.getElementById("input-name").value = "";
            document.getElementById("input-surname").value = "";
            document.getElementById("input-email").value = "";
        }

        const modifyButton = document.getElementById("modify-button");
        modifyButton.addEventListener("click", function () {
            const inputs = form.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            }
            document.getElementById("submit-button").disabled = true;
            document.getElementById("delete-button").disabled = true;

            const identityInput = document.createElement("input");
            identityInput.type = "number";
            identityInput.id = "identity-input";
            identityInput.placeholder = "Identity Value";
            form.insertBefore(identityInput, modifyButton);

            const submitIdentityButton = document.createElement("button");
            submitIdentityButton.type = "button";
            submitIdentityButton.id = "submit-identity-button";
            submitIdentityButton.textContent = "Submit Identity";
            form.insertBefore(submitIdentityButton, modifyButton);

            modifyButton.disabled = true;
            deleteButton.disabled = true;

            submitIdentityButton.addEventListener("click", function () {
                const identityValue = parseInt(document.getElementById("identity-input").value, 10);
                modifyGrid(identityValue);
            });
        });

        const modifyGrid = (identityValue) => {
            const gridItems = gridContainer.getElementsByClassName("grid-item");
            const gridItem = Array.from(gridItems).find(item => parseInt(item.dataset.identity, 10) === identityValue);
            if (gridItem) {
                const user = gridItem.querySelector("p:nth-of-type(2)").textContent.split(": ")[1];
                const name = gridItem.querySelector("p:nth-of-type(3)").textContent.split(": ")[1];
                const surname = gridItem.querySelector("p:nth-of-type(4)").textContent.split(": ")[1];
                const email = gridItem.querySelector("p:nth-of-type(5)").textContent.split(": ")[1];

                const inputs = form.getElementsByTagName("input");
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = false;
                }
                document.getElementById("submit-button").disabled = false;
                document.getElementById("delete-button").disabled = false;

                document.getElementById("identity-input").remove();
                document.getElementById("submit-identity-button").remove();

                const label = document.createElement("label");
                label.textContent = "ATTENTION: you selected the Modify option. You have now to type again the values.";
                form.insertBefore(label, modifyButton);

                const confirmButton = document.createElement("button");
                confirmButton.type = "button";
                confirmButton.id = "confirm-button";
                confirmButton.textContent = "Confirm";
                form.insertBefore(confirmButton, modifyButton);

                document.getElementById("input-user").value = user;
                document.getElementById("input-name").value = name;
                document.getElementById("input-surname").value = surname;
                document.getElementById("input-email").value = email;

                modifyButton.disabled = true;
                deleteButton.disabled = true;

                confirmButton.addEventListener("click", function () {
                    if (validateForm()) {
                        modifyGridItem(gridItem);
                    }
                });
            }
        }

        const validateForm = () => {
            const user = document.getElementById("input-user").value;
            const email = document.getElementById("input-email").value;

            if (checkUserExists(user)) {
                alert("User already exists. Please choose a different user.");
                return false;
            }

            if (checkEmailExists(email)) {
                alert("Email already exists. Please choose a different email.");
                return false;
            }

            if (!Email(email)) {
                alert("Invalid email format. Please enter a valid email.");
                return false;
            }

            return true;
        }

        const modifyGridItem = (gridItem) => {
            const user = document.getElementById("input-user").value;
            const name = document.getElementById("input-name").value;
            const surname = document.getElementById("input-surname").value;
            const email = document.getElementById("input-email").value;

            gridItem.querySelector("p:nth-of-type(2)").textContent = `User: ${user}`;
            gridItem.querySelector("p:nth-of-type(3)").textContent = `Name: ${name}`;
            gridItem.querySelector("p:nth-of-type(4)").textContent = `Surname: ${surname}`;
            gridItem.querySelector("p:nth-of-type(5)").textContent = `Email: ${email}`;

            const inputs = form.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = false;
            }
            document.getElementById("submit-button").disabled = false;
            document.getElementById("delete-button").disabled = false;

            document.querySelector("label").remove();
            document.getElementById("confirm-button").remove();

            clearInputFields();

            modifyButton.disabled = false;
            deleteButton.disabled = false;
        };

        const deleteButton = document.getElementById("delete-button");
        deleteButton.addEventListener("click", function () {
            const inputs = form.getElementsByTagName("input");
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            }
            document.getElementById("submit-button").disabled = true;
            document.getElementById("modify-button").disabled = true;

            const identityInput = document.createElement("input");
            identityInput.type = "number";
            identityInput.id = "identity-input";
            identityInput.placeholder = "Identity Value";
            form.insertBefore(identityInput, deleteButton);

            const submitIdentityButton = document.createElement("button");
            submitIdentityButton.type = "button";
            submitIdentityButton.id = "submit-identity-button";
            submitIdentityButton.textContent = "Submit Identity";
            form.insertBefore(submitIdentityButton, deleteButton);

            deleteButton.disabled = true;
            modifyButton.disabled = true;

            submitIdentityButton.addEventListener("click", function () {
                const identityValue = parseInt(document.getElementById("identity-input").value, 10);
                deleteGridItem(identityValue);
            });
        });

        const deleteGridItem = (identityValue) => {
            const gridItems = gridContainer.getElementsByClassName("grid-item");
            const gridItem = Array.from(gridItems).find(item => parseInt(item.dataset.identity, 10) === identityValue);
            if (gridItem) {
                gridContainer.removeChild(gridItem);

                const inputs = form.getElementsByTagName("input");
                for (let i = 0; i < inputs.length; i++) {
                    inputs[i].disabled = false;
                }

                document.getElementById("submit-button").disabled = false;
                document.getElementById("modify-button").disabled = false;

                document.getElementById("identity-input").remove();
                document.getElementById("submit-identity-button").remove();

                document.querySelector("label").remove();
                document.getElementById("confirm-button").remove();

                clearInputFields();

                deleteButton.disabled = false;
                modifyButton.disabled = false;
            }
        };