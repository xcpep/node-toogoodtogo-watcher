import moment from "moment";

export function renderMessageByFormats(businesses) {
  return {
    html: renderHtmlMessage(businesses),
    text: renderTextMessage(businesses),
  };
}

function renderTextMessage(businesses) {
  return businesses
    .map(
      (business) => `${business.display_name}
Price: ${business.item.price_including_taxes.minor_units / 100}
Quantity: ${business.items_available}
Pickup: ${formatInterval(business)}`
    )
    .join("\n\n");
}

function renderHtmlMessage(businesses) {
  return businesses
    .map(
      (business) => {
        let img = '';

        if (typeof business.previousData !== 'undefined') {
          let prevAvail = business.previousData.items_available;
          let currAvail = business.items_available;

          if (currAvail === 0) {
            img = '🅾️ Sold Out - ';
          } else if (currAvail < prevAvail) {
            img = '🔻 - ';
          } else if (prevAvail === 0 && currAvail > 0) {
            img = '❇️ More Available - '
          }
        }

        return `${img}<a href="https://share.toogoodtogo.com/item/${business.item.item_id
          }">${business.display_name}</a>
💰 ${typeof prevAvail !== 'undefined' ? '<s>'+prevAvail+'</s> ' : ''}${business.items_available} @ £${business.item.price_including_taxes.minor_units / 100} each
⏰ ${formatInterval(business)}`;
      }
    )
    .join("\n\n");
}

function formatInterval(business) {
  if (!business.pickup_interval) {
    return "?";
  }
  const startDate = formatDate(business.pickup_interval.start);
  const endDate = formatDate(business.pickup_interval.end);
  return `${startDate} - ${endDate}`;
}

function formatDate(dateString) {
  return moment(dateString).calendar(null, {
    lastDay: "[Yesterday] HH:mm",
    sameDay: "[Today] HH:mm",
    nextDay: "[Tomorrow] HH:mm",
    lastWeek: "[Last Week] dddd HH:mm",
    nextWeek: "dddd HH:mm",
    sameElse: "L",
  });
}
